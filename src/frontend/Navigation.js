import React from 'react';
import { Link } from 'react-router-dom';

import PureSignOutButton from './pure/PureSignOutButton';
import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';

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
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
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
      <PureSignOutButton />
    </li>
  </ul>
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