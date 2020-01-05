import React, { Component } from 'react';
import {} from '../backend/firebase';
import queryString from 'query-string';
import { withAuthorization, AuthUserContext } from '../backend/session';
import ThreadsListPaginated from './ThreadsListPaginated';
import * as STATUSES from '../constants/statuses';
import * as DATACONFIG from '../constants/dataConfig';


class ViewAllThreadsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null
    };

  }

  componentDidMount() {
    /// Everything handled in <ThreadsList />

    const qs = queryString.parse(this.props.location.search);
    let activePage = qs ? qs.page : 1;

    this.setState({
      activePage: activePage,
      loading: false
    })
    
  }
  componentWillUnmount() {
    ///
  }

  componentDidUpdate() {
    ///
    
  }

  render() {
    const { error, loading, activePage } = this.state;

    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>ViewAllThreads</h1>
            {loading && <div>Loading ...</div>}
            {error && error.message}


            {!loading && 

              /// Rendered with !loading to prevent error from trying to load from undefined
              //
              //
              <ThreadsListPaginated
                statuses={[
                  STATUSES.VISIBLE,
                  STATUSES.VISIBLE_BREEDER
                ]}
                authUser={authUser}
                activePage={activePage}
                pageSize={DATACONFIG.THREADSLIST_PAGE_SIZE}
                pageSelectorVisible
                ctaView
                ctaEdit
              />
            }

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
