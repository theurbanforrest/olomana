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
    <Button
      href='/threads?page=1'
      block
    >
      View All
    </Button>
    <Button
      href={ROUTES.HOME}
      block
    >
      Home
    </Button>
    <Button
      href={ROUTES.ACCOUNT}
      block
    >
      Account
    </Button>

    {!!authUser && ROLES.ADMIN.includes(authUser.uid) && (
          <Button
            href={ROUTES.ADMIN}
            block
          >
            Admin
          </Button>
      )}
      <Button
        href={ROUTES.CREATE_THREAD}
        block
      >
        Create Thread
      </Button>
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