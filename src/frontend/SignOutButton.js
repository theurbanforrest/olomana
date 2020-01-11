import React from 'react';
import { Button } from 'react-bootstrap';
import { withFirebase } from '../backend/firebase';

const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut}>
    Sign Out
  </Button>
);
export default withFirebase(SignOutButton);