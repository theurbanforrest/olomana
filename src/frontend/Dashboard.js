import React, { Component } from 'react';
import {} from '../backend/firebase';
import MyThreadList from './MyThreadList';
import { withAuthorization, AuthUserContext } from '../backend/session';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      ///

    };
  }
  componentDidMount() {

    ///
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
              <MyThreadList
                userUid={authUser.uid}
              />
            </div>
          )}
        </AuthUserContext.Consumer>

    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(DashboardPage);
