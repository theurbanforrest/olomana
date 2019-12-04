/// This is a "smart" view that handles its own lifecycle & state

import React from 'react';
import PureButton from './pure/PureButton';
import  { FirebaseContext } from '../backend/firebase';

class Welcome extends React.Component {
  render() {

    return (
      <div class='Welcome'>
        <h1>Hello, {this.props.headline}</h1>
        <PureButton
          title={this.props.ctaName}
        />
        <FirebaseContext.Consumer>
          {firebase => {
            return <div>I've access to Firebase and render something.</div>;
          }}
        </FirebaseContext.Consumer>
      </div>


    );
  }
}

export default Welcome;
