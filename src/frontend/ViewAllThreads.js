import React, { Component } from 'react';
import {} from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';
import ThreadsList from './ThreadsList';
import * as STATUSES from '../constants/statuses';


class ViewAllThreadsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    /// Everything handled in <ThreadsList />
  }
  componentWillUnmount() {
    ///
  }

  render() {
    const { error, loading } = this.state;

    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>ViewAllThreads</h1>
            {loading && <div>Loading ...</div>}
            {error && error.message}

            <ThreadsList
              statuses={[STATUSES.VISIBLE]}
              authUser={authUser}
              ctaView
              ctaEdit
            />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

// This is public currently but let's keep the option of having it protected
// So set authUser => true

const condition = authUser => true; //!!authUser;
export default withAuthorization(condition)(ViewAllThreadsPage);
