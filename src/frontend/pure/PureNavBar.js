import React from 'react';
import { Link } from 'react-router-dom';

export default function PureNavBar(props) {

  return (

    <div>
      <ul>
        <li>
          <Link to={props.routes.LANDING}>Landing</Link>
        </li>
        <li>
          <Link to={props.routes.LOGIN}>Login</Link>
        </li>
        <li>
          <Link to={props.routes.HOME}>Home</Link>
        </li>
      </ul>
    </div>

  );

}