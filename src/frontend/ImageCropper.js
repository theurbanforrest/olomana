import React, { PureComponent } from 'react';
import { Modal } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Container, Col, Row, Image, Button } from 'react-bootstrap';

class ImageCropper extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      showViaState: true,
      crop: {
        unit: '%',
        width: 50,
        aspect: 1/1,

        src: null,
      },
      croppedBlob: {
        size: 0,
        name: null
      }
    };
  }

  /// Select and load in the file
  /// Using Javascript-Load-Image as detailed in react-image-crop
  /// https://github.com/DominicTobias/react-image-crop/issues/181
  //
  onSelectFile = event => {
    window.loadImage( event.target.files[0], 
      (img) => { 
        var base64data = img.toDataURL('image/jpeg');
        this.setState({ 
          src: base64data 
        }); 
      }, { orientation: true, } );
  }

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  /// On completion of user doing a crop
  //
  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  async makeClientCrop(crop) {

    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );

      this.setState({
        croppedImageUrl
      });
    }
  }


  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  /// Upload the croppedBlob to Storage
  //
  handleUpload = () => {

    const { src, croppedBlob, croppedImageUrl, crop } = this.state;
    const { thread, threadUid, firebase } = this.props;  /// Requires parent to be withFirebase()

        /// If this is a thread, put in /threads path.  Else fail gracefully
      //
      let entity = thread ? "threads" : "unknownEntity";

      /// If threadUid is present, put in /{threadUid} path.  Else fail gracefully
      //
      let identifier = threadUid ? threadUid : "unknownIdentifier";

      /// Get timestamp as a prefix for filename.  Prevents overwriting of files with same name
      /// e.g. Uploading from iPhone is always "image.jpeg" so need to differentiate
      //
      const utcCreated = new Date().getTime();
      const filename = `${utcCreated}_${croppedBlob.name}`;

      /// TO-DO: Abstract away to firebase -- https://github.com/theurbanforrest/olomana/issues/34
      /// Current problem is that when state changes, we do setState()
      /// Need to figure out how to abstract to separate file
      //

      const uploadTask = firebase.storage.ref(`images/${entity}/${identifier}/${filename}`)
        .put(croppedBlob);

      uploadTask.on(
        "state_changed",
        snapshot => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...

          /// Get the URL from Firebase Storage to confirm success
          this.props.firebase.storage
            .ref("images")
            .child(entity)
            .child(identifier)
            .child(filename)
            .getDownloadURL()
            .then(url => {
              this.setState({ url });
              alert('success!')
            })
            .catch(err => {
              alert(err.message);
            });

          
        }
      );

  }

  onModalClose = () => {

    /// Get function from parent to toggle off visibility
    //

    this.props.onClose();

  }
  

  /// Extended from https://github.com/DominicTobias/react-image-crop#usage
  /// 
  /// Get the cropped area as a blob --> setState() as croppedBlob
  /// Return the window.URL (for user to preview before uploading)
  //
  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;

        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);

        /// Sets the cropped area's blob in state
        /// to get uploaded later
        //
        this.setState({
          croppedBlob: blob
        });
        resolve(this.fileUrl);

      /** }, 'image/jpeg'); **/  /// Adding 'image/jpeg' as a param sets it as jpeg.  To be lossless re: image quality, leave blank
      })
    });
  }

  async getCroppedBlob() {
    const { src, crop, fileName } = this.state;
    const croppedImg = await this.getCroppedImg(src, crop, fileName);
  }

  render() {
    const { 
      crop, croppedImageUrl,croppedBlob,
      src,
      showViaState } = this.state;
    const { threadUid, uploadLimit, showViaProps } = this.props;

    return (

      <Modal
        show={showViaState ? true : false}
        size="lg"
        onHide={() => this.onModalClose()}
      >
        <Container className="ImageCropper">
          <Row>
            <Col>
              <input
                type="file"
                accept="image/*"
                onChange={this.onSelectFile}
              />
            </Col>
          </Row>
          <Row>
            <Col md="12">
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              )}
            </Col>
            <Col md="12">
              {croppedImageUrl &&
                <Image
                  src={croppedImageUrl}
                />
              }
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Button
                onClick={this.handleUpload}
                disabled={src && croppedBlob.size < uploadLimit ? false : true}
              >
                Upload
              </Button>
              <p>{croppedImageUrl}</p>
              <p>{croppedBlob.size}</p>
            </Col>
          </Row>
        </Container>
      </Modal>
    );
  }
}

export default ImageCropper;
