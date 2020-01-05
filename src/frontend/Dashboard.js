import React, { Component } from 'react';
import {} from '../backend/firebase';
import ThreadsListPaginated from './ThreadsListPaginated';
import { withAuthorization, AuthUserContext } from '../backend/session';
import * as STATUSES from '../constants/statuses';
import * as DATACONFIG from '../constants/dataConfig';

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /// Always initialize as true to prevent pre-mature rendering!
      //
      //
      loading: true,
      activePage: DATACONFIG.DASHBOARD_ACTIVE_PAGE

    };
  }
  componentDidMount() {
    /// Everything handled in <ThreadsList />

    this.setState({
      loading: false
    })

  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { loading, showHiddenByAdmin } = this.state;

    return (

        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              <h1>Dashboard</h1>
              <h3>Hello, {authUser.email}</h3>

              {loading && <div>Loading ...</div>}

              <ThreadsListPaginated
                title='My Threads'
                authUser={authUser}
                users={[
                  authUser.uid
                ]}
                statuses={[
                  STATUSES.VISIBLE_BREEDER
                ]}
                activePage={1}
                pageSize={DATACONFIG.THREADSLIST_PAGE_SIZE}
                ctaView
                ctaEdit
              />

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
                  activePage={1}
                  pageSize={DATACONFIG.HIDDENBYADMIN_PAGE_SIZE}
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
