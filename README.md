# Olomana
A digital product starter based on ReactJS and Firebase
BIG props to Robin Wieruch's starter guide: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial#react-router-for-firebase-auth

### Getting Started

##### Configure Firebase

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

##### Run Locally

Now you can run the app locally:

```bash
npm install
npm start
```

* App is now open on https://localhost:3000
* Sign Up, Log In functions are connected to your Firebase project.  You can see new users getting added in Authentication.
* Adding a user also logs a record in your Real-Time Database (RTD).

* /account and /home are only shown if you are logged in.  Else you get redirected back to /login.
* /admin shows a list of all users, pulled from the RTD.


### Mahalo Open Source!

* create-react-app
* react-router-dom
* recompose
* firebase

### Contributing

* We use this git branching model for version control: https://nvie.com/posts/a-successful-git-branching-model/

##### Current branches

* `master`: completion of Robin Wieruch's tutorial
* `develop`: Create Thread capability
* `feature/v1-posts`: WIP on View All & View My

