import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import sio from 'socket.io';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import s3Router from './s3Router';
const sgMail = require('@sendgrid/mail');

const app = express(),
  options = { 
    key: fs.readFileSync(__dirname + '/rtc-video-room-key.pem'),
    cert: fs.readFileSync(__dirname + '/rtc-video-room-cert.pem')
  },

  port = process.env.PORT || 3001,
  server = process.env.NODE_ENV === 'production' ?
    http.createServer(app).listen(port) :
    https.createServer(options, app).listen(port),
  io = sio(server);

app.use(cors());
app.options('*', cors());

// compress all requests
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

  const origin = req.get('origin');

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

if ('OPTIONS' == req.method) {
  res.sendStatus(204);
}
else {
    next();
  }
});

app.use(bodyParser.json());

app.use('/s3', s3Router({
  bucket: 'erdstervideo',
  ACL: 'public-read'
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sendemail', function (req, res) {  
    
  var to = req.body.toemail; 
  var from = process.env.SENDGRID_SENDER;
  var subject = req.body.subject;
  var html = req.body.mailbody;
  console.log("html " + html);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: html,
  };
  sgMail.send(msg).then(onSuccess, onFail);

  function onSuccess(resp) {
    res.send({
      status: 'success',
      data: resp
    });
  }

  function onFail(resp) {
    console.log(resp);
    res.send({
     status: 'error'
    });
  }

});

app.use((req, res) => res.sendFile(__dirname + '/public/index.html'));
app.use(favicon('./public/favicon.ico'));

// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');
io.sockets.on('connection', socket => {
  let room = '';
  const create = err => {
    if (err) {
      return console.log(err);
    }
    socket.join(room);
    socket.emit('create');
  };
  // sending to all clients in the room (channel) except sender
  socket.on('message', message => socket.broadcast.to(room).emit('message', message));
  socket.on('find', () => {
    const url = socket.request.headers.referer.split('/');
    room = url[url.length - 1];
    const sr = io.sockets.adapter.rooms[room];
    if (sr === undefined) {
      // no room with such name is found so create it
      socket.join(room);
      socket.emit('create');
    } else if (sr.length === 1) {
      socket.emit('join');
    } else { // max two clients
      socket.emit('full', room);
    }
  });
  socket.on('auth', data => {
    data.sid = socket.id;
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('approve', data);
  });
  socket.on('accept', id => {
    io.sockets.connected[id].join(room);
    // sending to all clients in 'game' room(channel), include sender
    io.in(room).emit('bridge');
  });
  socket.on('reject', () => socket.emit('full'));
  socket.on('leave', () => {
    // sending to all clients in the room (channel) except sender
    socket.broadcast.to(room).emit('hangup');
    socket.leave(room);});
});
