import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../backend/firebase';
import * as ROUTES from '../constants/routes';
import * as STATUSES from '../constants/statuses';
import { withAuthorization, AuthUserContext } from '../backend/session';
import ImageUpload from '../frontend/ImageUpload';


const ThreadEditorPage = () => (

  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>ThreadEditorForm</h1>
        <ThreadEditorForm
          userUid={authUser.uid}
        />
      </div>
    )}
  </AuthUserContext.Consumer>

);

const INITIAL_STATE = {
    isOwner: null,

  /// Props to get initial data
    thread: {
      uid: null
    },
    loading: true,

  /// Props for the form (based on CreateThread.js)
    headline: '',
    price: 0,
    body: '',
    contact: '',

  /// Error handling
    error: null
}



class ThreadEditorBase extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }
  onSubmit = event => {
    const {

      headline,
      price,
      body,
      contact

    } = this.state;

      /// TO-DO

      //x. Get UTC timestamp (for ordering purposes)
      //x. Get user's UID (so we know who this post belongs to)
      //x. Set status as 1 (visible)

      //Future: need to refactor /threads to have both createdTime && lastUpdated

      const {pathname} = this.props.location;

      //Get the last 20 chars from path
      //All Google Firestore uid's are 20 chars in length
      //Future: May need to adjust if changing vendors
      //
      const uid = pathname.substr(8,20); //'9zcUmoQ4jh63aZo1y112';
      let utc = new Date().getTime();

      let userUid = this.props.userUid;

      this.props.firebase
        .fsThread(uid)
        .update({

          /// Update everything EXCEPT status
          // This allows users to edit posts flagged by Admins without them getting published
          // Until an Admin actually unflags it

          //indexables
          utc,
          userUid,

          //all others
          headline,
          price,
          body,
          contact

        }).then(resp => {

          //reset form back to empty
          this.setState({ ...INITIAL_STATE });

          //and re-route to /dashboard
          this.props.history.push(ROUTES.DASHBOARD);

        })
        event.preventDefault();
        
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onDelete = () => {

    /*** TO DO ***/

    /// / 1. Prompt "Are You Sure?"
    // Future: This should be a UI component, not the crappy browser fallback
    //
    let resp = window.confirm('Are you sure you want to delete this?  You cannot undo this.');

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

        status: STATUSES.DELETED    /// status -1 indicates it is marked for deletion
                      /// and will not be rendered in lists
      })
      .then(resp => {

          /// reset form back to empty
        this.setState({ ...INITIAL_STATE });

        /// and re-route to /dashboard
        this.props.history.push(ROUTES.DASHBOARD);

      })
      .catch(err =>
        this.setState({error: err})
      )
    }
    //y. On cancel, do nothing
    else {
      /// do nothing
    }

  };

  componentDidMount() {

    this.setState({ loading: true });  

    /// 1. Get the thread's data from Firestore
    //
    //
    /// Given path /thread/Vrz0QHjbXbJnB6G8MdlJ/edit
    /// Start after /thread/ (8 chars in) then extract the next 20 chars
    //
    /// All Google Firestore uid's are 20 chars in length
    /// Future: May need to adjust if changing vendors
    
    const {pathname} = this.props.location;
    const uid = pathname.substr(8,20);

    this.props.firebase
      .fsThread(uid)
      .get()
      .then(
        doc => {
          return doc.data()
      })
      .then(
        thr => {
          this.setState({
            threadUid: uid,
            thread: thr,
            headline: thr.headline,
            body: thr.body,
            price: thr.price,
            contact: thr.contact
          })
          return true
      })
      .then(
        () => {
        /// 2. Check if this thread belongs to the authenticated user
        ///
        this.setState({
          isOwner: this.state.thread.userUid === this.props.userUid ? true : false,
          loading: false
        })
      })
      .catch(err => {
          this.setState({
            error: err.message,
            loading: false
          })
      })
  }
  componentWillUnmount() {
    /// 
  }

  render() {

    const {
      isOwner,
      thread,
      loading,
      headline,
      body,
      price,
      contact,
      error
    } = this.state;
    
    const isInvalid =
      headline === '' ||
      price === 0;

    if(isOwner===false){
      return(
        <h3> You are not the owner so cannot edit this. </h3>
      );
    }
    else {
      return(
        <div>
          <h3>You are the owner so you can edit this!</h3>
          <h3>{thread.headline}</h3>
          <form onSubmit={this.onSubmit}>
            <input
              name="headline"
              value={headline}
              onChange={this.onChange}
              type="text"
              placeholder="Headline.."
            />
            <input
              name="price"
              value={price}
              onChange={this.onChange}
              type="number"
              placeholder="Price.."
            />
            <input
              name="body"
              value={body}
              onChange={this.onChange}
              type="text"
              placeholder="Enter a description.."
            />
            <input
              name="contact"
              value={contact}
              onChange={this.onChange}
              type="textarea"
              placeholder="e.g. Text Forrest at 808-422-2222"
            />
            <button disabled={isInvalid} type="submit">
              Update
            </button>
              {error && <p>{error.message}</p>}
          </form>
          <button onClick={() => 
            {
              this.onDelete()
            }}>
              Delete
            </button>
            {loading && <div>Loading ...</div>}

            {!loading && 
              <ImageUpload
                thread
                threadUid={this.state.threadUid}
              />
            }
        </div>
      );
    }
  }
}

const ThreadEditorForm = compose(
  withRouter,
  withFirebase,
)(ThreadEditorBase);


///  Must be authenticated in order to view
//
//  TO-DO: If user is not the owner, redirect - currently handled via UI
//
const condition = authUser =>
  !!authUser

export default withAuthorization(condition)(ThreadEditorPage);
export { ThreadEditorForm };
