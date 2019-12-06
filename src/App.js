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
import Welcome from './frontend/Welcome';
import SignUp from './frontend/SignUp';
import Login from './frontend/Login';
import PasswordForget from './frontend/PasswordForget';
import Account from './frontend/Account';


/// Navigation
///
import Navigation from './frontend/Navigation';
import * as ROUTES from './constants/routes';


/// Firebase
///
import { withFirebase } from './backend/firebase';
import {
  AuthUserContext,
  withAuthentication
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
            <Route exact path={ROUTES.LANDING} component={Welcome} />
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.HOME} component={Welcome} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
            <Route path={ROUTES.ACCOUNT} component={Account} />
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
