/// This is a "smart" view that handles its own lifecycle & state

import React from 'react';
import PureButton from './pure/PureButton';

class Welcome extends React.Component {
  render() {

    return (
      <div class='Welcome'>
        <h1>Hello, {this.props.headline}</h1>
        <PureButton
          title={this.props.ctaName}
        />
      </div>


    );
  }
}

export default Welcome;
