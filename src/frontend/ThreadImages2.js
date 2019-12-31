import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { withFirebase } from '../backend/firebase';
import {
  Container,
  Col,
  Row
} from 'react-bootstrap';
import TouchCarousel from 'react-touch-carousel';
import * as THEME from '../constants/theme';

class ThreadImages2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      loading: true,
      imageUrls: [],
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

  CarouselContainer(props) {

  }

  renderCard(state, index, modIndex, cursor) {
    const item = state.imageUrls[modIndex]
    // render the item
  }

  render() {
    const { imageUrls, loading, error } = this.state;

    return(
      <div>
        {!loading && imageUrls &&
          <TouchCarousel
            component={this.CarouselContainer}
            cardCount={imageUrls.length}
            cardSize={375}
            renderCard={this.renderCard(this.state)}
            loop
            autoplay={3000}
          />
        }
      </div>
    )
  }
}

export default withFirebase(ThreadImages2);