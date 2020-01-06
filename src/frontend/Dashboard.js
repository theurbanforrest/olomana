import React, { Component } from 'react';
import {} from '../backend/firebase';
import ThreadsListPaginated from './ThreadsListPaginated';
import { LoaderFullScreen } from '../frontend/Loaders';
import { withAuthorization, AuthUserContext } from '../backend/session';
import queryString from 'query-string';
import * as STATUSES from '../constants/statuses';
import * as DATACONFIG from '../constants/dataConfig';
import * as ROUTES from '../constants/routes';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /// Always initialize as true to prevent pre-mature rendering!
      //
      //
      activePage: 1,
      loading: true,
      error: null

    };
  }
  componentDidMount() {
    /// Everything handled in <ThreadsList />

    const qs = queryString.parse(this.props.location.search);
    let activePage = !qs ? qs.page : 1;

    this.setState({
      activePage: activePage,
      loading: false
    })

  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { loading, showHiddenByAdmin, activePage } = this.state;

    return (

        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <h1>Dashboard</h1>
              <h3>Hello, {authUser.email}</h3>

              {loading &&
                <LoaderFullScreen
                  type="BallTriangle"
                />
              }

              {!loading &&
                <ThreadsListPaginated
                  title='My Threads'
                  authUser={authUser}
                  users={[
                    authUser.uid
                  ]}
                  statuses={[
                    STATUSES.VISIBLE,
                    STATUSES.VISIBLE_BREEDER
                  ]}
                  activePage={activePage}
                  pageSize={DATACONFIG.DASHBOARD_PAGE_SIZE}
                  paginatedSlug={ROUTES.DASHBOARD_PAGINATED_SLUG}
                  ctaView
                  ctaEdit
                />
              }

              { showHiddenByAdmin &&
                <ThreadsListPaginated
                  title='Hidden By Admin'
                  authUser={authUser}
                  users={[
                    authUser.uid
                  ]}
                  statuses={[
                    STATUSES.HIDDEN_BY_ADMIN
                  ]}
                  activePage={activePage}
                  ctaView
                  ctaEdit
                  ctaUnhide
                  pageSelectorVisible
                />
              }

            </div>
          )}
        </AuthUserContext.Consumer>

    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(DashboardPage);
