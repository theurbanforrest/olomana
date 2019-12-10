/*** THREADSLIST

A single component that can be used for multiple different scenarios of
listing Threads

https://github.com/theurbanforrest/olomana/issues/23

***/


import React, { Component } from 'react';
import { withFirebase } from '../backend/firebase';
import {} from '../backend/session';
import { Link } from 'react-router-dom';
import * as ROLES from '../constants/roles';
import * as STATUSES from '../constants/statuses';

class ThreadsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      threads: [],
      error: null
    };

  }
  componentDidMount() {

    this.getData();
    
  }
  componentWillUnmount() {
    ///
  }

  render() {
    const { threads, loading, error } = this.state;

    return (
      <div>
        <h5> ThreadsList module </h5>
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
                {this.props.ctaView && 
                  <span>
                    <Link to={`thread/${thread.path}`}> View </Link>
                  </span>
                }
                { this.props.ctaEdit &&
                  this.props.authUser.uid === thread.data.userUid && 
                  <span>
                    <Link to={`thread/${thread.path}/edit`}> Edit </Link>
                  </span>
                }
                { this.props.ctaUnhide &&
                  ROLES.ADMIN.includes(this.props.authUser.uid) &&
                  <button onClick={() => 
                  {
                    this.onUnhideThread(thread.path)
                  }}>
                    Unhide
                  </button>
                }
            </li>
          ))}
          {threads.length < 1 && 
            <p> You have no threads. </p>
          }
          {error && <p>{error.message}</p>}
        </ul>
      </div>
    );
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

  getData() {

    const users = this.props.users;
    const statuses = this.props.statuses;

    /// Build the query based on the props
    ///

    let myQueryRef = this.props.firebase;

    // USERS
    //

    if(users){
      if(users.length === 1){
        if(statuses) {
          myQueryRef = myQueryRef.fsThreadsByUserAndStatus(users[0],statuses);
        }
        else myQueryRef = myQueryRef.fsThreadsByUser(users[0]);
      }
      else if(users.length > 1){
        // TO-DO in the future
      }
    }
    else myQueryRef = myQueryRef.fsThreadsByStatus(statuses);

    /// Run the query and organize the data

    this.setState({ loading: true });
    myQueryRef.get()
    .then(
      querySnapshot => {

        // Firestore is unable to get us the path as part of .data()
        // So we need to get it ourselves
        //

        let DocsArray = [];
        for(let i=0;i<querySnapshot.docs.length;i++){

          let x = {};
          x.path = querySnapshot.docs[i].id;
          x.data = querySnapshot.docs[i].data();

          DocsArray.push(x);
        }
        return DocsArray;
      }
    )
    .then(
      arr => {

      // Now make threads.path and threads.data avail in state
      //

      this.setState({
        threads: arr,
        loading: false

      })

    })
    .catch(
      err => {

        // Any errors will show a UI message for now
        //

        this.setState({error: err})
      }
    )

  }
}

// This component does not manage if it's public vs. protected so okay to leave basic
export default withFirebase(ThreadsList);
