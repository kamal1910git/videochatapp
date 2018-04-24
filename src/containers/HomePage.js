import React from 'react'
import { connect } from 'react-redux'
import { Offline, Online } from 'react-detect-offline';
import $ from 'jquery'
import Home from '../components/Home'
import store from '../store'

class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    value: new Date() - new Date().setHours(0, 0, 0, 0)
  }
  static contextTypes = {
    router: React.PropTypes.object
  }
  setRoom = () => this.setState({value: new Date() - new Date().setHours(0, 0, 0, 0)})
  joinRoom = e => {
    e.preventDefault();
    this.context.router.push('r/' + this.state.value);
  }
  handleChange = e => this.setState({value: e.target.value})

  handleLogoutClick = e => {
    e.preventDefault();
    localStorage.clear('BrillioUser_Token');
    this.context.router.push('/');
  }

  handleLeftNavClick = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('BrillioUser_Token'));
    if (!user) {
      this.context.router.push('/');
    }
    else{
      this.context.router.push('/RoomList');
    } 
  }

  componentWillMount() {
    const user = JSON.parse(localStorage.getItem('BrillioUser_Token'));
    if (!user) {
      this.context.router.push('/');
    } 
  }
  
  componentDidMount() {

    document.body.className="bodyOverrideBack";

    $("a#sidemenuBtn").click(function() {
        $('div.sidebar').toggle('slow');
        $('div.sidebar').toggleClass('in');
        $('div.content-area').toggleClass('in');

    });

    $("#panelFullScreen").click(function() {
        if ($(this).children('i').hasClass('fa-expand')) {
            $(this).children('i').removeClass('fa-expand');
            $(this).children('i').addClass('fa-compress');
        } else if ($(this).children('i').hasClass('fa-compress')) {
            $(this).children('i').removeClass('fa-compress');
            $(this).children('i').addClass('fa-expand');
        }
        $(this).closest('.panel').toggleClass('panel-fullscreen');
    });

    function checkWidth() {
      if ($(window).width() < 768) {
          $('div.sidebar').addClass('in');
          $('div.content-area').addClass('in');
          $('div.sidebar').css('display','none');
          
      } else {
          $('div.sidebar').removeClass('in');
          $('div.content-area').removeClass('in');
          $('div.sidebar').css('display','block');
      }
    }

    setHeight();

    $(window).resize(function() {
      checkWidth();      
    });

    function setHeight() {      
      var windowHeight = $(window).innerHeight();
      $('.card-wizard').css('height', windowHeight - 180);
    };

    $(".card-wizard").scroll();
  }

  render(){
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div id="navbar" className="navbar-collapse ">
              <ul className="nav navbar-nav">
                <li className='cursor-indication'><a><span className="avatar"><img src="assets/img/user.png" /></span>&nbsp;<span className="proName"><strong>Nombre</strong></span></a></li>                
                <li className='cursor-indication' style={{paddingTop: 8}}><a ><i className="fa fa-circle" />&nbsp;<strong style={{fontSize: 16}}><Online>Online</Online><Offline>Offline</Offline></strong></a></li>
              </ul>
              <ul className="nav navbar-nav navbar-right">                
                <li className='cursor-indication'><a onClick={this.handleLogoutClick.bind(this)}><img src="assets/img/scv-img/logout.svg" width={28} /></a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container-fluid main-panel">         
          <div className="content-area">
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default card-wizard panel-bg">
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="col-md-6 col-sm-4 col-xs-4 ">
                          <img src="assets/img/brillio-logo.png" className="img-responsive" />
                        </div>
                        <div className="clearfix" />
                      </div>
                      <div className="col-md-12">
                        <div className="col-md-12 col-sm-12 col-xs-12">                          
                              <Home
                              roomId={this.state.value}
                              handleChange={this.handleChange}
                              joinRoom={this.joinRoom}
                              setRoom={this.setRoom}
                              rooms={this.props.rooms}></Home>                        
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
          <img src="assets/img/brillio-logo.png" className="img-responsive pull-right footer-img" />
        </footer>
      </div>
    );
  }
}
const mapStateToProps = store => ({rooms: new Set([...store.rooms])});
export default connect(mapStateToProps)(HomePage);