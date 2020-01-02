import React from 'react';
import ImageCropper from './ImageCropper';
import * as DATACONFIG from '../constants/dataConfig';
import { withFirebase } from '../backend/firebase';

class Sandbox extends React.Component {
  render() {

  	const { firebase } = this.props;

    return (

      <ImageCropper
      	threadUid={null}
      	uploadLimit={DATACONFIG.IMAGECROPPER_UPLOAD_SIZE_LIMIT}  //Bytes.  i.e. 1M bytes == 100 kb
      	firebase={firebase}
      />

    );
  }
}

export default withFirebase(Sandbox);
