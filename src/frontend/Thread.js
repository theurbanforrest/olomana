import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';


const ThreadPage = () => (
  <div>
    <h1>Thread</h1>
    <Thread />
  </div>
);

class ThreadBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      thread: {},
      error: null,
      loading: false

    };
  }
  componentDidMount() {

    /// 1. Get the thread's data from Firestore
    ///
    ///

    this.setState({ loading: true });

    const {pathname} = this.props.location;

    //Get the last 20 chars from path
    //All Google Firestore uid's are 20 chars in length
    //Future: May need to adjust if changing vendors
    //
    const uid = pathname.substr(8,20); //'9zcUmoQ4jh63aZo1y112';

    this.props.firebase
      .fsThread(uid)
      .get()
      .then(
        doc => {

          return doc.data()
          
        }
      )
      .then( s => {

        this.setState({
            thread: s,
            loading: false

          })

      })
      .catch(
        err => {
          this.setState({error: err})
        }
      )

    /// 2. Check if this thread belongs to the authenticated user
    ///
    ///

    /** toDo() **/
  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { thread, error, loading } = this.state;


    return (
        <AuthUserContext.Consumer>
          {authUser => (
            <div>
              {loading &&

                <Loader
                 type="BallTriangle"
                 color="#d8d8d8"
                 height={60}
                 width={130}
                 timeout={3000} //3 secs
                />
              }
              {!loading &&

                <div>
                  <h3>{thread.headline}</h3>
                  <p><strong>Price: </strong>{thread.price}</p>
                  <br/><br/>
                  <p>{thread.body}</p>
                  <h6><strong>Contact: </strong>{thread.contact}</h6>
                  {
                    !!authUser && ROLES.ADMIN.includes(authUser.uid) && (
                    <button onClick={() => 
                      {
                        this.onHideThread()
                      }}>
                        Hide As Admin
                      </button>
                  )}
                  {error && <p>{error.message}</p>}
                </div>
              }
            </div>
          )}
        </AuthUserContext.Consumer>
    );
  }

  onHideThread() {
    /*** TO DO ***/

    /// / 1. Prompt "Are You Sure?"
    // Future: This should be a UI component, not the crappy browser fallback
    //
    let resp = window.confirm('As an Admin, you are about to hide this.  Continue?');

    /// x. If true, then update status to -1
    ///
    // To the User this is "deleted" because it never renders in the UI
    // Data-wise, will keep in case we need to "restore"
    // Future: write a job that periodically (every 7 days?) permanently deletes all -1 threads
    //
    if(resp){

      const {pathname} = this.props.location;
      const uid = pathname.substr(8,20); //'9zcUmoQ4jh63aZo1y112';
      this.props.firebase
      .fsThread(uid)
      .update({

        status: 83    /// status -1 indicates it is marked for deletion
                      /// and will not be rendered in lists
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
}

const Thread = compose(
  withRouter,
  withFirebase,
)(ThreadBase);


//This is currently public but we want to have the option to protect later
//Also we might want the auth'd user to do things e.g. edit their own post inline

const condition = authUser => true  //!!authUser;
export default withAuthorization(condition)(ThreadPage);
