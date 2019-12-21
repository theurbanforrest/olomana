import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';
import {
  Row,
  Col,
  Image
} from 'react-bootstrap';

class ThreadImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      loading: true,
      images: []

    };
  }
  componentDidMount() {
    this.setState({loading: true});
    this.getAllImages(this.props.threadUid)
  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { thread, error, loading } = this.state;
    const { threadUid, storageRootPath, firebase } = this.props;

    return(
        <Row>
          <h5>ThreadImages</h5>
          <Col xs={6} md={4}>
            <Image src={this.state.images[0]} rounded />
          </Col>
        </Row>
    )
  }

  getAllImages(threadUid){

    const { storageRootPath, firebase } = this.props;

    /// TO-DO: Figure out how to get listAll() to work
    // And then how to display all the images
    //
    //
      firebase.storage
        .ref('images')
        .child('threads')
        .child(threadUid)
        .listAll()
      .then((resp) => {
        alert(resp)
      })
  }
}

export default withFirebase(ThreadImages);