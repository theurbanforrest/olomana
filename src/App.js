/// APP.JS
/// All changes to the UI are done from here

import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


/// Views
///
import Landing from './frontend/Landing';
import SignUp from './frontend/SignUp';
import Login from './frontend/Login';
import PasswordForget from './frontend/PasswordForget';
import Account from './frontend/Account';
import Home from './frontend/Home';
import Admin from './frontend/Admin';
import CreateThread from './frontend/CreateThread';
import ViewAllThreads from './frontend/ViewAllThreads';
import Dashboard from './frontend/Dashboard';
import Thread from './frontend/Thread';


/// Navigation
///
import Navigation from './frontend/Navigation';
import * as ROUTES from './constants/routes';


/// Firebase
///
import { withFirebase } from './backend/firebase';
import {
  AuthUserContext
} from './backend/session';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  render(){
    return (

      /// AuthUserContext provided to all routes in the router
      ///
      <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <div>
            <Navigation />
            <hr />
            <Route exact path={ROUTES.LANDING} component={Landing} />
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.HOME} component={Home} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
            <Route path={ROUTES.ACCOUNT} component={Account} />
            <Route path={ROUTES.ADMIN} component={Admin} />

            <Route path={ROUTES.CREATE_THREAD} component={CreateThread} />
            <Route path={ROUTES.VIEW_ALL_THREADS} component={ViewAllThreads} />
            <Route path={ROUTES.DASHBOARD} component={Dashboard} />
            <Route path={ROUTES.THREAD} component={Thread} />
          </div>
        </Router>
      </AuthUserContext.Provider>
    );
  } 

  componentWillUnmount() {
    this.listener();
  }
}

/// Export withFirebase() to connect everything in App to the same Firebase instance
/// vs. creating too many
///
export default withFirebase(App);
