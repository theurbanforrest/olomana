import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';
import SignOutButton from './SignOutButton';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <div class="navigation">
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
    </li>
    <li>
      <a href='/threads?page=1'>View All</a>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    {!!authUser && ROLES.ADMIN.includes(authUser.uid) && (
        <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
      )}
    <li>
      <Link to={ROUTES.CREATE_THREAD}>Create Thread</Link>
    </li>

    <li>
      <SignOutButton />
    </li>
  </ul>
  </div>
);
const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.LOGIN}>Login</Link>
    </li>
  </ul>
);

export default Navigation;