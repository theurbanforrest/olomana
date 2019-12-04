import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


import Welcome from './frontend/Welcome';
import SignUp from './frontend/SignUp';
import Login from './frontend/Login';

import PureNavBar from './frontend/pure/PureNavBar';
import * as ROUTES from './constants/routes';

const App = () => (
  <Router>
    <div>
      <PureNavBar

        routes={ROUTES}

      />
      <hr />
      <Route exact path={ROUTES.LANDING} component={Welcome} />
      <Route path={ROUTES.LOGIN} component={Login} />
      <Route path={ROUTES.HOME} component={Welcome} />
      <Route path={ROUTES.SIGN_UP} component={SignUp} />
    </div>
  </Router>
);
export default App;
