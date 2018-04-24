import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store';
import { Router, Route, browserHistory } from 'react-router'
import Login from './containers/Login'
import Home from './containers/HomePage'
import Room from './containers/RoomPage'
import NotFound from './components/NotFound'
import styles from './style/app.css'

render(<Provider store={store}>
		<Router history={browserHistory}>		
		<Route path="/" component={Login} />
		<Route path="/home" component={Home} />
		<Route path="/r/:room" component={Room} />
		<Route path="*" component={NotFound} />
	</Router>
</Provider>, document.getElementById('app'))
