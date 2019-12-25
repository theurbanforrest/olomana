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
      imageRefs: [
        './logo512.png'
      ],
      imageUrls: [],

      /** TO-DO: Proven that this works to get image **/
      helloWorld: null

    };
  }
  componentDidMount() {

    const { threadUid, firebase } = this.props;

    /** TO-DO -- Abstract this function away to firebase **/

    /// Get all files for this thread
    //
    //
    firebase.storage.ref().child('/images/threads/' +threadUid).list({ maxResults: 6})
      .then(resp => {
        
        this.setState({
          imageRefs: resp.items
        })
      })
      .then(() => {
        /// getDownloadURL() for each of the files
        //
        //
        this.state.imageRefs.forEach((image, index) => {
          image.getDownloadURL()
            .then(resp => {
              this.setState({
                imageUrls: [...this.state.imageUrls, resp]
              })
            })
        });

        /// Resolve the function
        //
        //
        this.setState({loading: false});
        return true;

      })
      .catch(err => {
        this.setState({
          loading: false,
          error: err.message
        })

        return false;
      })

  }
  componentWillUnmount() {

    /// 
  }

  render() {
    const { thread, error, helloWorld, imageRefs, imageUrls, loading } = this.state;
    const { threadUid, storageRootPath, firebase } = this.props;

    return(
        <Row>
          <h5>ThreadImages</h5>
          <Col xs={6} md={4}>
            {!loading &&
              <div>
                {imageUrls.map(url => (
                  <Image src={url} />
                ))}
              </div>
            }
            {error &&
              <p>{error}</p>
            }
          </Col>

        </Row>
    )
  }
}

export default withFirebase(ThreadImages);