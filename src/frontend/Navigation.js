import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';
import SignOutButton from './SignOutButton';
import { slide as SuperMenu } from 'react-burger-menu';
import * as THEME from '../constants/theme';
import {
  Button
} from 'react-bootstrap';

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
  <SuperMenu
    pageWrapId='routes-wrapper'
    outerContainerId='root'
    styles={THEME.NAVBAR}
  >
    <Button
      href={ROUTES.LANDING}
      block
    >
      Landing
    </Button>
    <Button
      href={ROUTES.DASHBOARD}
      block
    >
      Dashboard
    </Button>
      <a href='/threads?page=1'>View All</a>
      <a href={ROUTES.HOME}>Home</a>
      <a href={ROUTES.ACCOUNT}>Account</a>

    {!!authUser && ROLES.ADMIN.includes(authUser.uid) && (
          <a href={ROUTES.ADMIN}>Admin</a>
      )}
      <a href={ROUTES.CREATE_THREAD}>Create Thread</a>
      <SignOutButton />
  </SuperMenu>
);
const NavigationNonAuth = () => (
  <SuperMenu
    pageWrapId='routes-wrapper'
    outerContainerId='root'
    styles={THEME.NAVBAR}
  >
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.LOGIN}>Login</Link>
    </li>
  </SuperMenu>
);

export default Navigation;