import React, { Component } from 'react';
import {} from '../backend/firebase';
import queryString from 'query-string';
import { withAuthorization, AuthUserContext } from '../backend/session';
import ThreadsListPaginatedCards from './ThreadsListPaginatedCards';
import * as STATUSES from '../constants/statuses';
import * as DATACONFIG from '../constants/dataConfig';
import * as ROUTES from '../constants/routes';


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
              <ThreadsListPaginatedCards
                statuses={[
                  STATUSES.VISIBLE,
                  STATUSES.VISIBLE_BREEDER
                ]}
                title={'ViewAllThreads'}
                authUser={authUser}
                activePage={activePage}
                pageSize={DATACONFIG.VIEWALLTHREADS_PAGE_SIZE}
                paginatedSlug={ROUTES.VIEW_ALL_THREADS_PAGINATED_SLUG}
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
