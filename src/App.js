import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Layout from './Layout'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {UnauthenticatedRoute, AuthenticatedRoute} from './utils/authenticate'
import { matchPath } from 'react-router'
import { useTranslation, withTranslation, Trans } from 'react-i18next';



const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login/Login'))

const Page404 = React.lazy(() => import('./views/Pages/Page404/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500/Page500'));
// let cors = require('cors')
// app.use(cors())
toast.configure()

// const isAuthenticated = () => {
//   //write your condition here
//   return true;
// }

// page uses the hook
// function Page() {
//   const { t, i18n } = useTranslation();

//   const changeLanguage = lng => {
//     i18n.changeLanguage(lng);
//     window.location.reload();
//   };

//   return (
//     <div className="lan-buttons">
//        <button onClick={() => changeLanguage('de')}>de</button>
//         <button onClick={() => changeLanguage('en')}>en</button>
//         <button onClick={() => changeLanguage('es')}>es</button>
//     </div>
//   );
// }


class App extends Component {
 //Once Login Ready Then In Login Component  UnauthenticatedRoute
 //Once Login Required Of Any Page Then In AuthenticatedRoute
 constructor(props,context)
 {
   super(props, context);
 } 
 render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          {/* for multilanguage enable Page */}
          {/* <Page /> */}
          <Switch>
            {/* for Demo / Production */}
            <UnauthenticatedRoute exact path="/login" name="Login" component={Login} />
            <Route exact path="/" component={Login} />
            <Route path='/' render={(props) => <Layout {...props} /> } />
      
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            {/* <AuthenticatedRoute path="/" name="Home" component={DefaultLayout} /> */}
            {/* for Development */}
            {/* <Route exact path="/login" name="Login" component={Login} />
            <Route exact path="/register" name="Register" component={Register} />
            <Route exact path="/forgotpassword" name="Forgot Password" component={ForgotPassword} />
            <Route exact path="/resetpassword/:token?" name="Reset Password" component={ResetPassword} />
            <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
            <Route path="/" name="Home" component={DefaultLayout} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
