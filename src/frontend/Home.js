import React from 'react';
import { withAuthorization } from '../backend/session';
const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </div>
);
const condition = authUser => authUser != null;
export default withAuthorization(condition)(HomePage);