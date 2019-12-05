import React from 'react';
import { withFirebase } from '../../backend/firebase';

const PureSignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);
export default withFirebase(PureSignOutButton);