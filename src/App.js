import React, {
  Component
} from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


import Welcome from './frontend/Welcome';
import SignUp from './frontend/SignUp';
import Login from './frontend/Login';

import Navigation from './frontend/Navigation';
import * as ROUTES from './constants/routes';

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
      <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <div>
            <Navigation />
            <hr />
            <Route exact path={ROUTES.LANDING} component={Welcome} />
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.HOME} component={Welcome} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
          </div>
        </Router>
      </AuthUserContext.Provider>
    );
  } 

  componentWillUnmount() {
    this.listener();
  }
}

export default withFirebase(App);
