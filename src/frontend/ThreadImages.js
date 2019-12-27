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

    /// Get all files for this thread
    //
    //
    firebase.stThreadGetImageRefs(threadUid)
      .then(resp => {

        /// getDownloadURL() for each of the files
        //
        //
        resp.forEach((image, index) => {

          firebase.stImageGetUrl(image)
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

            {!loading &&
              <Row>
                {imageUrls.map(url => (
                  <Col md={4}>
                    <Image src={url} />
                  </Col>
                ))}
              </Row>
            }
            {error &&
              <p>{error}</p>
            }
        </Row>
    )
  }
}

export default withFirebase(ThreadImages);