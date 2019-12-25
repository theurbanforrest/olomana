import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
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
      imageUrls: []

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
    const { imageUrls, loading, error } = this.state;

    return(
        <Row>
          {loading &&
            <Loader
             type="BallTriangle"
             color="#d8d8d8"
             height={60}
             width={130}
             timeout={3000} //3 secs
            />
          }
          <h5>ThreadImages</h5>
          <Col xs={12} md={6}>
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