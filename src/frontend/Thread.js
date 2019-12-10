import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';


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
              <h5>This is a Thread.  It is currently protected to authenticated users only.</h5>
              <h3>{thread.headline}</h3>
              <p><strong>Price: </strong>{thread.price}</p>
              <br/><br/>
              <p>{thread.body}</p>
              <h6><strong>Contact: </strong>{thread.contact}</h6>
              {loading && <div>Loading ...</div>}
              {error && <p>{error.message}</p>}
            </div>
          )}
        </AuthUserContext.Consumer>

    );
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
