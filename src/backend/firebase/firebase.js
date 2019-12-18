///Firebase.js

/// Configure
	import app from 'firebase/app';
		import 'firebase/auth';
		import 'firebase/database';
		import 'firebase/firestore';
		import 'firebase/storage';

	import * as DATACONFIG from '../../constants/dataConfig';

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

	  	// 1. App
	  	// 2. Authentication
	  	// 3. Database (real-time)
	  	// 4. Firestore
	  	// 5. Storage
	  	//
	    app.initializeApp(firebaseConfig);
	    this.auth = app.auth();
	    this.db = app.database();
	    this.firestore = app.firestore();
	    this.storage = app.storage();
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

	  	// *** Merge Auth and DB User API *** //
			onAuthUserListener = (next, fallback) =>
				this.auth.onAuthStateChanged(authUser => {

					if (authUser) {
						this.user(authUser.uid)
							.once('value')
							.then(snapshot => {

								const dbUser = snapshot.val();
								// default empty roles
								if (!dbUser.status) {
								  dbUser.status = 0;
								}
								// merge auth and db user
								authUser = {
								  uid: authUser.uid,
								  email: authUser.email,
								  ...dbUser,
								};

							next(authUser);
						});
					} else {
						fallback();
					}
				});
    	///
    	///
  		// *** Firestore Database API ***

  			// *** Threads ***

	  			fsThread = uid => this.firestore
	  				.collection(`threads`)
	  				.doc(`${uid}`);

	  			fsThreadsByUser = (uid) => this.firestore
	  				.collection(`threads`)
	  				.where('userUid','==',`${uid}`)

	  			fsThreads = () => this.firestore
	  				.collection(`threads`)

	  			fsThreadsByStatus = (statusArr) => this.firestore
	  				.collection(`threads`)
	  				.where('status','in',statusArr)

	  			fsThreadsByUserAndStatus = (uid,statusArr) => this.firestore
	  				.collection(`threads`)
	  				.where('userUid','==',`${uid}`)
	  				.where('status','in',statusArr)


	  		// *** ThreadsList ***

	  			fsGetThreadsList = async(inputs) => {

	  				const users = inputs.users;
	  				const statuses = inputs.statuses;
	  				const activePage = inputs.activePage;

				    // USERS
				    //

				    if(users){
				      if(users.length === 1){
				        if(statuses) {
				          return this.fsThreadsByUserAndStatusPaginated(users[0],statuses,activePage); //(users[0],statuses);
				        }
				        else return this.fsThreadsByUser(users[0])	//TO-DO still needs to be paginated
				      }
				      else if(users.length > 1){
				        // TO-DO in the future
				      }
				    }
				    else return this.fsThreadsByStatusPaginated(statuses,activePage);

	  			}

	  			fsThreadsByUserAndStatusPaginated = async(uid,statusArr,pageNum) => {

	  				const pageSize = DATACONFIG.THREADSLIST_PAGE_SIZE;


	  				return this.fsThreadsByUserAndStatus(uid,statusArr)
	  					.get()
	  					.then(qs => {

	  						return this.fsTransform(qs,pageNum,pageSize)
	  					})
	  					.catch(err => {
	  						alert('firebase error: ' + err.message)
	  					})

	  			}

	  			fsThreadsByStatusPaginated = async(statusArr,pageNum) => {

	  				const pageSize = DATACONFIG.THREADSLIST_PAGE_SIZE;

	  				return this.fsThreadsByStatus(statusArr)
	  					.get()
	  					.then(qs => {

	  						return this.fsTransform(qs,pageNum,pageSize)
	  					})
	  					.catch(err => {
	  						alert('firebase error: ' + err.message)
	  					})

	  			}

	  			fsTransform = (querySnapshot,pageNum,pageSize) => {

	  				// Firestore is unable to get us the path as part of .data()
					// So we need to get it ourselves
					//

					//e.g. given pageNum == 8, pageSize == 10

					const querySize = querySnapshot.size;
					const startIndex = (pageNum * pageSize) - pageSize;
					let endIndex = startIndex + pageSize;

					/// DEBUG --- alert(querySize + '|' +startIndex + '|' +endIndex+ 'inputes: '+pageNum+'|'+pageSize);

					/// If this segment is incomplete, then update to max
					//
					//

					if(endIndex + 1 > querySize){

						endIndex = querySize;

					}

					//startIndex is 79, endIndex is 89
					//e.g. reading the 80th thru 90th docs

					let DocsArray = [];

					for(let i=startIndex;i<endIndex;i++){

					let x = {};
					x.path = querySnapshot.docs[i].id;
					x.data = querySnapshot.docs[i].data();

					DocsArray.push(x);
					}

					// Then add the query cursor for the next set of data to get
					//
					//

					const response = {
						data: DocsArray,
						fullQuerySize: querySize,
						pageNum: pageNum
					}

					return(response)

	  			}


	  			/**
	  			fsThreadsByStatusPaginated = (statusArr,pageNum) => {

	  				let pageSize = DATACONFIG.THREADSLIST_PAGE_SIZE;

	  				return this.fsThreadsByStatus(statusArr)
	  					.get()
	  					.then(
	  						querySnapshot => {

	  							// Firestore is unable to get us the path as part of .data()
								// So we need to get it ourselves
								//

								//e.g. given pageNum == 8, pageSize == 10

								const querySize = querySnapshot.size;
								const startIndex = (pageNum * pageSize) - pageSize;
								let endIndex = startIndex + pageSize;

								/// If this segment is incomplete, then update to max
								//
								//

								if(endIndex + 1 > querySize){

									endIndex = querySize;

								}

								//startIndex is 79, endIndex is 89
								//e.g. reading the 80th thru 90th docs

								let DocsArray = [];

								for(let i=startIndex;i<endIndex;i++){

								let x = {};
								x.path = querySnapshot.docs[i].id;
								x.data = querySnapshot.docs[i].data();

								DocsArray.push(x);
								}

								// Then add the query cursor for the next set of data to get
								//
								//

								const response = {
									data: DocsArray,
									fullQuerySize: querySize,
									pageNum: pageNum
								}

								return(response)
					          
					        }
	  					)
	  					.catch(err => {alert('firebase error: ' + err.message)})
	  					
	  			}
			**/
	  			

	}

export default Firebase;