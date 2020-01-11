import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { AuthUserContext } from '../backend/session';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';
import SignOutButton from './SignOutButton';
import { slide as SuperMenu } from 'react-burger-menu';
import * as THEME from '../constants/theme';

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

    <Navbar.Brand href={ROUTES.LANDING}>
      <img
        alt=""
        src="/favicon.ico"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
        {' '}Project Olomana
    </Navbar.Brand>

    <Navbar.Brand href={ROUTES.DASHBOARD}>Dashboard</Navbar.Brand>
    <Navbar.Brand href="/threads?page=1">View All</Navbar.Brand>
    <Navbar.Brand href={ROUTES.HOME}>Home</Navbar.Brand>
    <Navbar.Brand href={ROUTES.ACCOUNT}>Account</Navbar.Brand>
    <Navbar.Brand href={ROUTES.CREATE_THREAD}>Create Thread</Navbar.Brand>

    <SignOutButton />

    {!!authUser && ROLES.ADMIN.includes(authUser.uid) && (

      <Navbar.Brand href={ROUTES.ADMIN}>Admin Tools</Navbar.Brand>

    )}
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