import React from 'react'
import { Link } from 'react-router'
import { Offline, Online } from 'react-detect-offline';

const Home = props =>
  <div className="home">
    <div>
      <h1 itemProp="headline" style={{color: '#fff'}}>Ready to create video chat room</h1>
      <p style={{color: '#fff'}}>Please enter a room name.</p>
      <form onSubmit={props.joinRoom}>
        <input type="text" name="room" className="form-control" value={props.roomId} onChange={props.handleChange} pattern="^\w+$" maxLength="10" required autoFocus title="Room name should only contain letters or numbers."/>
        <br/>
        <Online><button className="btn btn-primary btn-block login-button" type="submit">Create Room</button></Online>        
        <Offline><button disabled="true" className="btn btn-primary btn-block login-button" type="submit">Create Room</button></Offline>
      </form>      
    </div>
  </div>;
Home.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
  joinRoom: React.PropTypes.func.isRequired,
  setRoom: React.PropTypes.func.isRequired,
  roomId: React.PropTypes.string.isRequired,
  rooms: React.PropTypes.object.isRequired
};
export default Home;
