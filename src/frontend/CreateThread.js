import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { compose } from 'recompose';

import { withFirebase } from '../backend/firebase';
import * as ROUTES from '../constants/routes';
import { withAuthorization, AuthUserContext } from '../backend/session';


const CreateThreadPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>CreateThread</h1>
        <CreateThreadForm
          userUid={authUser.uid}
        />
        <HomeLink />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  headline: '',
  price: 0,
  body: '',
  contact: '',
  error: null
};


class CreateThreadFormBase extends Component {
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


      //x. Get UTC timestamp (for ordering purposes)
      //x. Get user's UID (so we know who this post belongs to)
      //x. Set status as 1 (visible)

      const utcCreated = new Date().getTime();
      const utcModified = utcCreated;
      let userUid = this.props.userUid;
      let status = 1;

      this.props.firebase
        .fsThreads()
        .add({

          //indexables
          utcCreated,
          utcModified,
          userUid,
          status,

          //all others
          headline,
          price,
          body,
          contact
        })
        .catch(error => {
          this.setState({ error });
        })
        .then(resp => {

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


  render() {

    const {
      headline,
      body,
      price,
      contact,
      error
    } = this.state;

    
    const isInvalid =
      headline === '' ||
      price === 0;

    return (

      <Container>
        <Form onSubmit={this.onSubmit}>
          
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
              md="6"
              controlId="formPrice"
            >
              <Form.Control
                disabled={false}
                name="price"
                value={price}
                onChange={this.onChange}
                type="number"
                placeholder="Price.."

              />
            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="formContact"
            >
              <Form.Control
                disabled={false}
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
                disabled={false}
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
          <Row>
            <Form.Group as={Col}>
              <Button
                variant="dark"
                type="submit"
                disabled={isInvalid ? true : false}
              >
              Create Thread
              </Button>
            </Form.Group>
          </Row>
        </Form>
        {error && 
          <h5>{error}</h5>
        }
      </Container>
    );
  }
}

const HomeLink = () => (
  <p>
    <Link to={ROUTES.HOME}>Back to Home</Link>
  </p>
);

const CreateThreadForm = compose(
  withRouter,
  withFirebase,
)(CreateThreadFormBase);


const condition = authUser => !!authUser;
export default withAuthorization(condition)(CreateThreadPage);
export { CreateThreadForm, HomeLink };