This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Olomana
A digital product starter based on ReactJS and Firebase
BIG props to [Robin Wieruch's starter guide][https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial#react-router-for-firebase-auth]

### Getting Started

##### Firebase

Create a new `.env.local` file in project's root with your Firebase creds:
`
	REACT_APP_API_KEY=xxx
	REACT_APP_AUTH_DOMAIN=xxx
	REACT_APP_DATABASE_URL=xxx
	REACT_APP_PROJECT_ID=xxx
	REACT_APP_STORAGE_BUCKET=xxx
	REACT_APP_MESSAGING_SENDER_ID=xxx
	REACT_APP_APP_ID=xxx
	REACT_APP_MEASUREMENT_ID=xxx
`

These come straight from the Firebase console's settings. You need to convert from JSON to these REACT_APP_ prefixed vars.

##### App

```bash
npm install
npm start
```

App is now open on https://localhost:3000

### Open Source

* create-react-app
* react-router-dom
* recompose
* firebase


