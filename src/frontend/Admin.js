import React, { Component } from 'react';
import { compose } from 'recompose';
import UserList from './UserList';
import { withFirebase } from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';
import * as STATUSES from '../constants/statuses';
import HiddenByAdminList from './HiddenByAdminList';



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

  onUnhideThread(uid) {

    /// / 1. Prompt "Are You Sure?"
    // Future: This should be a UI component, not the crappy browser fallback
    //
    let resp = window.confirm('As an Admin, you are about to unhide this.  Continue?');

    /// x. If true, then update status to -1
    ///
    // To the User this is "deleted" because it never renders in the UI
    // Data-wise, will keep in case we need to "restore"
    // Future: write a job that periodically (every 7 days?) permanently deletes all -1 threads
    //
    if(resp){

      this.props.firebase
      .fsThread(uid)
      .update({
        status: STATUSES.VISIBLE   
      })
      .then(resp => {

        /// Re-route to /admin, to see where it is hidden
        this.props.history.push(ROUTES.ADMIN);

      })
      .catch(err =>
        this.setState({error: err})
      )
    }
    //y. On cancel, do nothing
    else {
      /// do nothing
    }
  }

  render() {
    const { users, loading } = this.state;

    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>Admin</h1>
            <p>
              The Admin Page is accessible by every signed in admin user.
            </p>
            {loading && <div>Loading ...</div>}

            <UserList users={users} />
            <HiddenByAdminList
            />

          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

/// Only show if authUser is designated as Global Admin
//
/// Checks if the /users uid exists in the Admin list.  For some reason,
/// if we check status (i.e. status === 82), the component renders but
/// there is nothing in the UI.  We know this works because negative tests
/// correctly redirect to /login

const condition = authUser =>
  !!authUser && ROLES.ADMIN.includes(authUser.uid);

export default compose(
    withAuthorization(condition),
    withFirebase,
)(AdminPage);