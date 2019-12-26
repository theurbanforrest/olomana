import React, { Component } from "react";
import { withFirebase } from '../backend/firebase';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      url: "",
      progress: 0
    };
  }

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleUpload = () => {
    const { image } = this.state;
    const { thread, threadUid, firebase } = this.props;

    /// If this is a thread, put in /threads path.  Else fail gracefully
    //
    let entity = thread ? "threads" : "unknownEntity";

    /// If threadUid is present, put in /{threadUid} path.  Else fail gracefully
    //
    let identifier = threadUid ? threadUid : "unknownIdentifier";

    /// Get timestamp as a prefix for filename.  Prevents overwriting of files with same name
    /// e.g. Uploading from iPhone is always "image.jpeg" so need to differentiate
    //
    const utc = new Date().getTime();
    const filename = `${utc}_${image.name}`;

    /// TO-DO: Abstract away to firebase -- https://github.com/theurbanforrest/olomana/issues/34
    //
    const uploadTask = firebase.storage.ref(`images/${entity}/${identifier}/${filename}`).put(image);
    
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
        this.props.firebase.storage
          .ref("images")
          .child(entity)
          .child(identifier)
          .child(filename)
          .getDownloadURL()
          .then(url => {
            this.setState({ url });
          });
      }
    );
  };
  render() {
    return (
      <div className="center">
          <br/>
          <h2 className="green-text">React Firebase Image Uploader</h2>
          <br/>
          <br/>
        <div className="row">
          <progress value={this.state.progress} max="100" className="progress" />
        </div>
        <br />
        <br />
        <br />
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
            <input type="file" onChange={this.handleChange} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          onClick={this.handleUpload}
          className="waves-effect waves-light btn"
        >
          Upload
        </button>
        <br />
        <br />
        <img
          src={this.state.url || "https://via.placeholder.com/400x300"}
          alt="Uploaded Images"
          height="300"
          width="400"
        />
      </div>
    );
  }
}
export default withFirebase(ImageUpload);


