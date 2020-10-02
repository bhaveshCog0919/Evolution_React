import React from 'react';
import { Route,Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
// export const getAccessToken = () => Cookies.get('access_token')
// export const getRefreshToken = () => Cookies.get('refresh_token')
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () =>  localStorage.getItem('refresh_token');
export const isAuthenticated = () => !!getAccessToken()

// Authetication.js Refrence Urls 
// https://github.com/coreui/coreui-free-react-admin-template/issues/113
// https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication //Check GG.'s answer for refrence

export const UnauthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        !isAuthenticated()
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
);

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAuthenticated()
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);

// export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={(props) => {
//         let path = props.location.pathname.split('/');
//         if(isAuthenticated()){
//             if(path[1] === 'editContactDetails' && props.location.state === undefined){
//                 return props.history.goBack();
//             }else{
//                 return <Component {...props} />
//             }
//         }else{
//             return <Redirect to='/login' />
//         }
//     }} />
// );