import React, { Component } from 'react';
import { compose } from 'recompose';
import { withAuthorization } from '../backend/session';
import { withFirebase } from '../backend/firebase';
import * as STATUSES from '../constants/statuses';
import * as ROLES from '../constants/roles';

class HiddenByAdminList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      threads: [],
      error: null
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .fsThreadsByStatus([
        STATUSES.HIDDEN_BY_ADMIN
      ])
      .get()
      .then(
        querySnapshot => {

          //Firestore is unable to get us the path as part of .data()
          //So we need to get it ourselves

          let DocsArray = [];
          for(let i=0;i<querySnapshot.docs.length;i++){

            let x = {};

            x.path = querySnapshot.docs[i].id;
            x.data = querySnapshot.docs[i].data();

            DocsArray.push(x);

          }

          return DocsArray;
        
          /*** This is the query to get all the doc data WITHOUT path
          //much simpler but it does not satisfy the reqs

          return querySnapshot.docs.map(
            doc => doc.data())

          */
          
        }
      )
      .then( s => {

        this.setState({
            threads: s,
            loading: false

          })

        /*** useful debugger message
          alert('this.state is now ' + JSON.stringify(this.state));
        ***/

      })
      .catch(
        err => {
          this.setState({error: err})
        }
      )
  }
  componentWillUnmount() {
    ///
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
        /// Since we're already on /admin, just reload
        //
        window.location.reload() 

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
    const { threads, loading, error } = this.state;

    return (
      <div>
        <h5> HiddenByAdminList module </h5>
        <ul>
          {loading && <div>Loading ...</div>}
          {threads.map(thread => (
            <li key={thread.path}>
              <span>
                <strong>ID:</strong> {thread.path}
              </span>
              <span>
                <strong>Headline:</strong> {thread.data.headline}
              </span>
              <span>
                <strong>Price:</strong> {thread.data.price}
              </span>
              <span>
                <strong>Status:</strong> {thread.data.status}
              </span>
              <button onClick={() => 
                  {
                    this.onUnhideThread(thread.path)
                  }}>
                    Unhide
                  </button>
            </li>
          ))}
          {threads.length < 1 && 
            <p> No threads have been Hidden By Admin. </p>
          }
          {error && <p>{error.message}</p>}
        </ul>
      </div>
    );
  }
}

const condition = authUser =>
  !!authUser && ROLES.ADMIN.includes(authUser.uid);

export default compose(
    withAuthorization(condition),
    withFirebase,
)(HiddenByAdminList);




