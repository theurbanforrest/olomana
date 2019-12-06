/// This is a "smart" view that handles its own lifecycle & state

import React from 'react';
import PureButton from './pure/PureButton';

class Landing extends React.Component {
  render() {

    return (
      <div class='Welcome'>
        <h1>Landing</h1>
        <PureButton
          title={this.props.ctaName}
        />
      </div>


    );
  }
}

export default Landing;
