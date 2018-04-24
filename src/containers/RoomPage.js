import React from 'react'
import MediaContainer from './MediaContainer'
import CommunicationContainer from './CommunicationContainer'
import { connect } from 'react-redux'
import store from '../store'
import io from 'socket.io-client'
import { Offline, Online } from 'react-detect-offline';

class RoomPage extends React.Component {
  constructor(props) {
    super(props);
  }
  getUserMedia = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  }).catch(e => alert('getUserMedia() error: ' + e.name))
  socket = io.connect()
  componentWillMount() {
    this.props.addRoom();
  }
  render(){
    return (   
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">            
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li style={{paddingTop: 8}}><a href="#"><i className="fa fa-circle" />&nbsp;<strong style={{fontSize: 16}}><Online>Online</Online><Offline>Offline</Offline></strong></a></li>
            </ul>            
          </div>
        </div>
      </nav>
      <div className="container-fluid main-panel">        
        <div className="content-area in">  
          <div className="row">
            <div>
                <MediaContainer media={media => this.media = media} socket={this.socket} getUserMedia={this.getUserMedia} />
                <CommunicationContainer socket={this.socket} media={this.media} getUserMedia={this.getUserMedia} />
             </div>
          </div>
        </div>
      </div> 
      </div>
    );
  }
}
const mapStateToProps = store => ({rooms: new Set([...store.rooms])});
const mapDispatchToProps = (dispatch, ownProps) => (
    {
      addRoom: () => store.dispatch({type: 'ADD_ROOM', room: ownProps.params.room})
    }
  );
export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);
