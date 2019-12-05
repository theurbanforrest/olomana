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

import PureNavBar from './frontend/pure/PureNavBar';
import * as ROUTES from './constants/routes';

import { withFirebase } from './backend/firebase';


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
        <Router>
          <div>
            <PureNavBar

              routes={ROUTES}
              authenticated={this.state.authUser}

            />
            <hr />
            <Route exact path={ROUTES.LANDING} component={Welcome} />
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.HOME} component={Welcome} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
          </div>
        </Router>
    );
  } 

  componentWillUnmount() {
    this.listener();
  }
}

export default withFirebase(App);
