/***

withAuthorization higher-order component

> Manages redirects based on when the authentication state changes (from firebase)

***/


import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../firebase';
import AuthUserContext from './context';

import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {

  class WithAuthorization extends React.Component {

    componentDidMount() {

      /// When the authenticated user changes, run this function
      //
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(ROUTES.LOGIN);
          }
        },
        () => this.props.history.push(ROUTES.LOGIN),
      );
    }
    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
  
};

export default withAuthorization;