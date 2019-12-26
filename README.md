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

##### 3. Deploy

It's a good idea to set up 2 projects: 1 Beta and 1 Production.  When ready to deploy to an environment, it's easy.  Run via command line:

```bash
npm run-script build
firebase use name-of-your-firebase-project
firebase deploy
```

Note that .env.local applies to both environments.  For environment-specific configs, we need to still get this from a service (still TBD - likely Firebase SiteConfig)


### Firebase

Firebase was chosen as our backend because of its near turnkey functions, thorough docs, and freemium model.  Services this project uses:


* Authentication: the Source Of Record (SOR) for all unique users
* Realtime Database: $$ by connection, not action.  Therefore, using for common lookups (i.e. /users for user data) and future online/offline features.  Does not scale well but not a near-term issue.
* Firestore: Great NoSQL db for querying and pagination, both of which we will use heavily.  Also scales better supposedly.
* Storage: For user-upload files (i.e. images for Threads)

### Active Branches

`master` is the completion of Robin Wieruch's tutorial
`develop` is working towards completion of a true boilerplate

