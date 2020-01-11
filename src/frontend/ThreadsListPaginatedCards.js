/*** ThreadsListPaginatedCards

A single component that can be used for multiple different scenarios of
listing Threads

https://github.com/theurbanforrest/olomana/issues/23

***/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Container, Row } from 'react-bootstrap';
import { withFirebase } from '../backend/firebase';
import {} from '../backend/session';
import { LoaderFullScreen } from './Loaders';
import ThreadCard from './ThreadCard';
import PageSelector from './PageSelector';
import * as STATUSES from '../constants/statuses';

class ThreadsListPaginatedCardsBase extends Component {
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
      pageSelectorVisible,

      ctaEdit,
      authUser

    } = this.props;

    return (
      <Container>
      <Row>
          {loading &&

            <LoaderFullScreen
               type="BallTriangle"
            />

          }
          {!loading && threads.map(thread => (
                <ThreadCard
                  key={thread.path}
                  headline={thread.data.headline}
                  price={thread.data.price}
                  body={thread.data.body.substr(0,280)}
                  thumbnailUrl={thread.data.defaultImageUrl}
                  viewUrl={`thread/${thread.path}/dynamic`}
                  viewThru={()=>this.props.history.push(`thread/${thread.path}/dynamic`)}
                  isOwner={ctaEdit && authUser.uid === thread.data.userUid ? true : false}
                >
                </ThreadCard>
          ))}
        </Row>
        <Row>
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
        </Row>
      </Container>
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

const ThreadsListPaginatedCards = compose(
  withRouter,
  withFirebase,
)(ThreadsListPaginatedCardsBase);

// This component does not manage visibility
//
export default ThreadsListPaginatedCards;
