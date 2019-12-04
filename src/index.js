/// INDEX.JS
/// This is the Global context of the web app


/// Imports, singletons

import React from 'react';
import ReactDOM from 'react-dom';
import Firebase, { FirebaseContext } from './backend/firebase';

/// Imports, all other
import App from './App.js';


ReactDOM.render(
	<FirebaseContext.Provider value={new Firebase()}>
		<App
			headline='My Headline'
			ctaName='My CTA'
		/>
	</FirebaseContext.Provider>,
	document.getElementById('root')
);

