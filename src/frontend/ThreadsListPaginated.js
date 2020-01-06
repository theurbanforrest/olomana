/*** ThreadsListPaginated

A single component that can be used for multiple different scenarios of
listing Threads

https://github.com/theurbanforrest/olomana/issues/23

***/
import React, { Component } from 'react';
import { withFirebase } from '../backend/firebase';
import {} from '../backend/session';
import { Link } from 'react-router-dom';
import { LoaderFullScreen } from '../frontend/Loaders';
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
    const {
      activePage,
      pageSize,
      paginatedSlug,
      pageSelectorVisible
    } = this.props;

    return (
      <div>
        <h5>{this.props.title}</h5>
        <ul>
          {loading &&

            <LoaderFullScreen
               type="BallTriangle"
            />

          }
          {!loading && threads.map(thread => (
            <li key={thread.path}>
              <span>
                <b>{thread.data.headline}</b>
              </span>
              {` - `}
              <span>
                {thread.data.price}
              </span>
                {this.props.ctaView && 
                  <span>
                    <Link to={`thread/${thread.path}/dynamic`}> View </Link>
                  </span>
                }
                { /*** Leaving in ctaEdit so user can instantly see which posts are their's ***/
                 
                  this.props.ctaEdit &&
                  this.props.authUser.uid === thread.data.userUid && 
                  <span>
                    <Link to={`thread/${thread.path}/dynamic`}> Edit </Link>
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
          {!loading && pageSelectorVisible &&

            <PageSelector
              activePage={activePage}
              pageSize={pageSize}
              paginatedSlug={paginatedSlug}
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
    const pageSize = this.props.pageSize;
    const activePage = this.props.activePage;

    /// Build the function based on the props
    //
    //
    this.setState({ loading: true });

    let inputs = {
      users: users,
      statuses: statuses,
      pageSize: pageSize,
      activePage: activePage,

    }

    this.props.firebase.fsGetThreadsList(inputs)
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
