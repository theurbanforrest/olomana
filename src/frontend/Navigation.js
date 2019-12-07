import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import SignOutButton from './SignOutButton';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div class="navigation">
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
    </li>
    <li>
      <Link to={ROUTES.VIEW_ALL_THREADS}>View All</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
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