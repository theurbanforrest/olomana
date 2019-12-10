import React, { Component } from 'react';
import {} from '../backend/firebase';
import ThreadsList from './ThreadsList';
import { withAuthorization, AuthUserContext } from '../backend/session';
import * as STATUSES from '../constants/statuses';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      ///

    };
  }
  componentDidMount() {
    /// Everything handled in <ThreadsList />
  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { loading } = this.state;

    return (

        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <h1>Dashboard</h1>
              <h3>Hello, {authUser.email}</h3>

              <h5>My Threads</h5>
              {loading && <div>Loading ...</div>}

              <ThreadsList
                authUser={authUser}
                users={[authUser.uid]}
                statuses={[
                  STATUSES.VISIBLE,
                  STATUSES.HIDDEN_BY_ADMIN
                ]}
                ctaView
                ctaEdit
              />

            </div>
          )}
        </AuthUserContext.Consumer>

    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(DashboardPage);
