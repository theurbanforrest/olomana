/*** ThreadsListPaginated

A single component that can be used for multiple different scenarios of
listing Threads

https://github.com/theurbanforrest/olomana/issues/23

***/
import React, { Component } from 'react';
import { withFirebase } from '../backend/firebase';
import {} from '../backend/session';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import PageSelector from './PageSelector';
import * as ROLES from '../constants/roles';
import * as STATUSES from '../constants/statuses';

class ThreadsListPaginated extends Component {
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

    /// Declare data manipulated in this.state
    //
    //
    const { 
      threads, 
      loading,
      error,
      fullQuerySize

    } = this.state;

    /// Declare data manipulated by higher order component, passed via this.props
    //
    //
    let activePage = this.props.activePage;
    let pageSize = this.props.pageSize;

    return (
      <div>
        <h5>{this.props.title}</h5>
        <ul>
          {loading &&

            <Loader
               type="BallTriangle"
               color="#d8d8d8"
               height={60}
               width={130}
               timeout={3000} //3 secs
            />

          }
          {!loading && threads.map(thread => (
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
          {!loading && 

            <PageSelector
              activePage={activePage}
              pageSize={pageSize}
              fullQuerySize={fullQuerySize}
            />

          }
          {!loading && threads.length < 1 && 
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
    const activePage = this.props.activePage;

    /// Build the function based on the props
    ///


    this.setState({ loading: true });
    let myQuery = this.props.firebase;
    // USERS
    //

    if(users){
      if(users.length === 1){
        if(statuses) {
          myQuery = myQuery.fsThreadsByUserAndStatus; //(users[0],statuses);
        }
        else myQuery = myQuery.fsThreadsByUser; //(users[0]);
      }
      else if(users.length > 1){
        // TO-DO in the future
      }
    }
    else myQuery = this.props.firebase.fsThreadsByStatusPaginated;

    /// Run the query and organize the data

    myQuery(statuses,activePage)
    .then(
      resp => {

      // Now make threads.path, threads.data, available in state
      //

      this.setState({
        threads: resp.data,
        pageNum: resp.pageNum,
        fullQuerySize: resp.fullQuerySize,
        loading: false

      })

    })
    .catch(
      err => {

        // Any errors will show a UI message for now
        //

        this.setState({
          error: err,
          loading: false
        })
      }
    )

  }
}

// This component does not manage visibility
//
export default withFirebase(ThreadsListPaginated);
