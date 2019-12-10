import React, { Component } from 'react';
import {} from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }
  componentDidMount() {

    /// x. Check that auth'd user is an Admin (status 82)

    /// 1. Open connection to real-time database, get all docs from /users
    ///
    this.setState({ loading: true });
    this.props.firebase
      .users()
      .on('value', snapshot => {

      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }
  componentWillUnmount() {

    /// x. Close the connection on unmount
    ///
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;


    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Admin</h1>
            {loading && <div>Loading ...</div>}
            <UserList users={users} />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

/// Only show if authUser is designated as Global Admin (status 82)
//
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);