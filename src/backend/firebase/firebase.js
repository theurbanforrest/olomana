///Firebase.js

/// Configure
	import app from 'firebase/app';
		import 'firebase/auth';
		import 'firebase/database';
		import 'firebase/firestore';

	const firebaseConfig = {
	  apiKey: process.env.REACT_APP_API_KEY,
	  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	  databaseURL: process.env.REACT_APP_DATABASE_URL,
	  projectId: process.env.REACT_APP_PROJECT_ID,
	  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	};


/// Construct
	class Firebase {

	  constructor() {

	  	console.log('class Firebase constructor() start');

	  	//1. App
	    app.initializeApp(firebaseConfig);

	    //2. Authentication
	    this.auth = app.auth();

	    //3. Database
	    this.db = app.database();

	    //4. Firestore
	    this.firestore = app.firestore();

	    //x. Export

	    console.log('class Firebase constructor() end');
	  }

	  // *** Auth API ***
		  doCreateUserWithEmailAndPassword = (email, password) =>
		    this.auth.createUserWithEmailAndPassword(email, password);

		  doSignInWithEmailAndPassword = (email, password) =>
		    this.auth.signInWithEmailAndPassword(email, password);

		  doSignOut = () => this.auth.signOut();

		  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

		  doPasswordUpdate = password =>
		    this.auth.currentUser.updatePassword(password);

		// *** Real-Time Database API ***

			// *** Users ***
	  			user = uid => this.db.ref(`users/${uid}`);
	  			users = () => this.db.ref('users');

	  		// *** Threads ***
	  			thread = uid => this.db.ref(`threads/${uid}`);
	  			threads = () => this.db.ref('threads');

  		// *** Firestore Database API ***

  			fsThreadByUser = uid => this.firestore.collection(`threads`).where('userUid','==',`${uid}`);	
  			fsThreads = () => this.firestore.collection(`threads`);

	}

export default Firebase;