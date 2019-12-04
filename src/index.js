import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Welcome from './views/Welcome';



// ReactDOM.render(<App />, document.getElementById('root'));



ReactDOM.render(
	<Welcome
		headline='My Headline'
		ctaName='My CTA'
	/>,
	document.getElementById('root')
);

