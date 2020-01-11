/// This is a "pure" component. It only takes in props and does not manage state

import React from 'react';

export default function PureButton(props) {

  return (

  	<button>
  		{props.title}
  	</button>

  );

}