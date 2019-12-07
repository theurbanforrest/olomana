# Olomana
A digital product starter based on ReactJS and Firebase

##### Props First
BIG ups to Robin Wieruch's starter guide: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial#react-router-for-firebase-auth .  Highly recommended for anyone looking to give a full stack web app a go.

### Getting Started

##### 1. Configure Firebase

Create a new `.env.local` file in project's root with your Firebase creds:
```bash
	REACT_APP_API_KEY=xxx
	REACT_APP_AUTH_DOMAIN=xxx
	REACT_APP_DATABASE_URL=xxx
	REACT_APP_PROJECT_ID=xxx
	REACT_APP_STORAGE_BUCKET=xxx
	REACT_APP_MESSAGING_SENDER_ID=xxx
	REACT_APP_APP_ID=xxx
	REACT_APP_MEASUREMENT_ID=xxx
```

These come straight from the Firebase console's settings. You need to convert from JSON to these REACT_APP_ prefixed vars.

##### 2. Run Locally

Make sure you have npm installed (and that's all you need).  Run via command line:

```bash
npm install
npm start
```

* App is now open on https://localhost:3000
* Sign Up, Log In functions are connected to your Firebase project.  You can see new users getting added in Authentication.
* Adding a user also logs a record in Realtime Database.


* /account and /home are only shown if you are logged in.  Else you get redirected back to /login.
* /threads gets all from the Firestore Collection 'threads'
* /dashboard gets only the docs from 'threads' that belong to the logged in user.


### Firebase
* Authentication: the Source Of Record (SOR) for all unique users
* Realtime Database: $$ by connection, not action.  Therefore, using for common lookups (i.e. /users for user data) and future online/offline features.  Does not scale well but not a near-term issue.

* Firestore: Great NoSQL db for querying and pagination, both of which we will use heavily.  Also scales better supposedly.

