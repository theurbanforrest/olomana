import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Loader from 'react-loader-spinner';

import { compose } from 'recompose';
import { withFirebase } from '../backend/firebase';
import * as ROUTES from '../constants/routes';
import * as STATUSES from '../constants/statuses';
import * as DATACONFIG from '../constants/dataConfig';
import { withAuthorization, AuthUserContext } from '../backend/session';
import ImageCropper from '../frontend/ImageCropper';
import ThreadImages from '../frontend/ThreadImages';


const ThreadDynamicPage = () => (

  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <ThreadDynamic
          userUid={authUser.uid}
        />
      </div>
    )}
  </AuthUserContext.Consumer>

);

const INITIAL_STATE = {

  /// Props about owning or editing
    isOwner: null,
    isEditing: false,
    isAddingImage: false,

  /// Props to get initial data
    threadUid: null,
    thread: {
      uid: null
    },
    loading: true,

  /// Props for the form (based on CreateThread.js)
    headline: '',
    price: 0,
    body: '',
    contact: '',

  /// Original Props for the form - used for when user cancels out of editing
    ogHeadline: '',
    ogPrice: 0,
    ogBody: '',
    ogContact: '',

  /// Error handling
    error: null
}



class ThreadDynamicBase extends Component {

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };

  }

  getData = (props) => {

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
            contact: thr.contact,

            ogHeadline: thr.headline,
            ogBody: thr.body,
            ogPrice: thr.price,
            ogContact: thr.contact
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
      const utcModified = new Date().getTime();

      let userUid = this.props.userUid;

      this.props.firebase
        .fsThread(uid)
        .update({

          /// Update everything EXCEPT status
          // This allows users to edit posts flagged by Admins without them getting published
          // Until an Admin actually unflags it

          //indexables
          utcModified,
          userUid,

          //editable fields
          headline,
          price,
          body,
          contact

        }).then(resp => {

          //reset form back to empty
          this.setState({ ...INITIAL_STATE });

          //and re-load the new data by re-calling this.getData()
          //
          this.getData(this.props);

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

  onCancel = (state) => {

    this.setState({
      isEditing: false,
      headline: state.ogHeadline,
      price: state.ogPrice,
      body: state.ogBody,
      contact: state.ogContact
    })

  }

  onAddImage = () => { this.setState({ isAddingImage: true }) }

  onStopAddingImage = () => { this.setState({ isAddingImage: false}) }

  componentDidMount() {

    this.getData(this.props);
    
  }
  componentWillUnmount() {
    /// 
  }

  render() {

    const {
      isOwner,
      isEditing,
      isAddingImage,
      threadUid,
      thread,
      loading,
      headline,
      body,
      price,
      contact
    } = this.state;

    const { 
      firebase
    } = this.props;
    
    const isInvalid =
      headline === '' ||
      price === 0;

      return(

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
          {!loading && !isEditing &&
            <div>
              <h3>
                {thread.headline}&nbsp;
                - ${thread.price}
              </h3>
              <p><strong>
                {thread.contact}
              </strong></p>
            </div>
          }
          {!loading && !isEditing && isOwner &&
            <div>
              <Button
                variant="link"
                size="sm"
                onClick={()=>this.setState({isEditing: true})}
              >
                Edit Thread
              </Button>
              |
              <Button
                variant="link"
                size="sm"
                onClick={()=>this.onAddImage()}
              >
                Add Image
              </Button>
              |
              <Button
                variant="link"
                size="sm"
                onClick={()=>this.onDelete()}
              >
                Delete Thread
              </Button>
            </div>
          }
          {!loading && isEditing &&
            <Form onSubmit={this.onSubmit}>
              <Row>
                <Form.Group
                  as={Col}
                  md="2"
                >
                  <Button
                    variant="dark"
                    type="submit"
                    disabled={isInvalid ? true : false}
                  >
                  Done Editing  
                  </Button>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                >
                  <Button
                    variant="link"
                    onClick={()=>this.onCancel(this.state)}
                  >
                  Cancel
                  </Button>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="formHeadline"
                >
                  <Form.Control
                    disabled={false}
                    size="lg"
                    name="headline"
                    value={headline}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Headline.."
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="formPrice"
                >
                  <Form.Control
                    disabled={isEditing ? false : true}
                    name="price"
                    value={price}
                    onChange={this.onChange}
                    type="number"
                    placeholder="Price.."

                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="4"
                  controlId="formContact"
                >
                  <Form.Control
                    disabled={isEditing ? false : true}
                    name="contact"
                    value={contact}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Contact.."
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="formBody"
                >
                  <Form.Control
                    disabled={isEditing ? false : true}
                    as="textarea"
                    rows="10"
                    name="body"
                    value={body}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Body.."
                  />
                </Form.Group>
              </Row>
            </Form>
          }
          {!loading && !isEditing &&
              <Row>
                <Col md="6">
                  <ThreadImages
                    firebase={firebase}
                    threadUid={threadUid}
                    storageRootPath={`images/threads`}
                  />
                </Col>
                <Col md="6">
                  <Form.Group
                  as={Col}
                  md="12"
                  controlId="formBody"
                >
                  <Form.Control
                    disabled={true}
                    as="textarea"
                    rows="10"
                    name="staticBody"
                    value={thread.body}
                    type="text"
                  />
                  </Form.Group>
                </Col>
              </Row>
          }
          {!loading && isAddingImage &&
            <ImageCropper
              onClose={() => this.onStopAddingImage()}
              thread={thread}
              threadUid={threadUid}
              uploadLimit={DATACONFIG.FILE_UPLOAD_LIMIT}
              firebase={firebase}
            />
          }
        </div>

      );
  }
}

const ThreadDynamic = compose(
  withRouter,
  withFirebase,
)(ThreadDynamicBase);


///  Must be authenticated in order to view
//
//  TO-DO: If user is not the owner, redirect - currently handled via UI
//
const condition = authUser =>
  !!authUser

export default withAuthorization(condition)(ThreadDynamicPage);
export { ThreadDynamic };
