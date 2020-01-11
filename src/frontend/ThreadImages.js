import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
import {
  Carousel, Button
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
    const { isEditing } = this.props;
    const { imageUrls, loading, error, index, direction } = this.state;

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
          {!loading && isEditing &&
            <Button
              onClick={() => this.setDefaultImage()}
            >
              Set as Default
            </Button>
          }
          {!loading &&
            <Carousel
              interval={null}
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
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          }
          {error &&
            <p>{error}</p>
          }
        </div>
    )
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction,
    });
  }

  setDefaultImage() {

    const { threadUid, firebase } = this.props;
    const { index, imageUrls } = this.state;

    firebase
      .fsThread(threadUid)
      .update({

        defaultImageUrl: imageUrls[index]

      })
      .then(() => {
        alert('success!')
      })
      .catch(err => alert(err.message));
  }
}

export default withFirebase(ThreadImages);