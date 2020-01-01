import React from 'react';
import ImageCropper from './ImageCropper';
import { withFirebase } from '../backend/firebase';

class Sandbox extends React.Component {
  render() {

  	const { firebase } = this.props;

    return (

      <ImageCropper
      	threadUid={null}
      	firebase={firebase}
      />

    );
  }
}

export default withFirebase(Sandbox);
