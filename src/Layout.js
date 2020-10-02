import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './App.scss';
import IdleTimer from 'react-idle-timer';
import { IdleTimeOutModal } from './modal/IdleModal'
import Cookies from 'js-cookie';
import {UnauthenticatedRoute, AuthenticatedRoute} from './utils/authenticate'
import PropTypes from 'prop-types';
import api from '../src/utils/apiClient';

const ResetPassword = React.lazy(() => import('./views/Pages/ResetPassword/ResetPassword'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const ForgotPassword = React.lazy(() => import('./views/Pages/ForgotPassword/ForgotPassword'));
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const GetQuote = React.lazy(() => import('./views/Pages/GetQuote/GetQuote'));

class Layout extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            timeout:1000 * 3600 * 1 * 8, //(60*60*8 secound) for 8 hour for showing alert
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            sessiondisable:false
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.releaseLock = this.releaseLock.bind(this)
      }

    _onAction(e) {
      // console.log('user did something', e)
      this.setState({isTimedOut: false})
    }
   
    _onActive(e) {
      // console.log('user is active', e)
      this.setState({isTimedOut: false})
    }
   
    _onIdle(e) {
      // console.log('user is idle', e)
      const isTimedOut = this.state.isTimedOut
      if (isTimedOut) {
          localStorage.clear()
          this.props.history.push('/login')
      } else {
        this.setState({showModal: true})
        this.idleTimer.reset();
        this.setState({isTimedOut: true})
        this.setState({sessiondisable: true})
        setTimeout(() => {
          if(this.state.sessiondisable){
            localStorage.clear()
            this.props.history.push('/login')
          }
        }, 900000);//15 min alert logout
      }
      
    }

    handleClose() {
      this.setState({sessiondisable: false})
      this.setState({showModal: false})
    }

    handleLogout() {
      this.setState({showModal: false})
      this.releaseLock();
      localStorage.clear()
      this.props.history.push('/login')
    }

    async releaseLock(){
      let data = {
        'PolicyId' : '',
        'ReleaseAll' : 1
    };
    
    await api.post('api/releaseLock', data).then(res => {
        if (res.success) {
            console.log("sucess......")
        } else {
           console.log("SomeThing went wrong.");
        }
    }).catch(err => {
        console.log("setLock err", err);
    });
    }

    render(){
      const { match } = this.props
      return(
        <>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />
            <script src="http://fb.me/react-js-fiddle-integration.js"></script>
            <div className="">
                  <Switch>
                  <UnauthenticatedRoute exact path="/resetpassword/:token?" name="Reset Password" component={ResetPassword} />
                  <UnauthenticatedRoute exact path="/register" name="Register" component={Register} />
                  <UnauthenticatedRoute exact path="/forgotpassword" name="Forgot Password" component={ForgotPassword} />
                  <UnauthenticatedRoute exact path="/getQuote/:country" name="Get Quote" component={GetQuote} />
                  <AuthenticatedRoute path="/" name="Home" component={DefaultLayout} />
                  </Switch>
                
                <IdleTimeOutModal 
                    showModal={this.state.showModal} 
                    handleClose={this.handleClose}
                    handleLogout={this.handleLogout}
                />
            </div>
        </>
      )
   }

 }

 Layout.propTypes = {
     match: PropTypes.any.isRequired,
     history: PropTypes.func.isRequired
 }

export default Layout