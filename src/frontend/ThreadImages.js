import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
import {
  Container,
  Col,
  Row,
  Carousel
} from 'react-bootstrap';
import * as THEME from '../constants/theme'

class ThreadImages extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      
      loading: true,
      imageUrls: [],
      index: 0,
      direction: null,
      error: null

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
    const { imageUrls, loading, error, index, direction } = this.state;

    return(
        <Container>
            {loading &&
              <Loader
               type="BallTriangle"
               color="#d8d8d8"
               height={60}
               width={130}
               timeout={3000} //3 secs
              />
            }
           <Row>
              <Col sm={12} md={4}>
                {!loading &&
                      <Carousel
                        activeIndex={index}
                        direction={direction}
                        onSelect={this.handleSelect}
                        style={THEME.IMAGE_CAROUSEL}
                      >
                        {imageUrls.map(url => (
                          <Carousel.Item key={url}>
                            <img
                              className="d-block w-100"
                              src={url}
                              alt="First slide"
                            />
                            <Carousel.Caption>
                              <h3>Third slide label</h3>
                              <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                              </p>
                            </Carousel.Caption>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                }
              </Col>
            </Row>
            <Row>
              {error &&
                <p>{error}</p>
              }
            </Row>
        </Container>
    )
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction,
    });
  }
}

export default withFirebase(ThreadImages);