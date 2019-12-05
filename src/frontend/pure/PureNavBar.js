import React from 'react';
import { Link } from 'react-router-dom';
import PureSignOutButton from './PureSignOutButton';

export default function PureNavBar(props) {

  return (

    <div>
      <ul>
        ///Static
        <li>
          <Link to={props.routes.LANDING}>Landing</Link>
        </li>


        
        {/// If Authenticated
          props.authenticated &&

          <div>
            <li>
              <Link to={props.routes.HOME}>Home</Link>
              <h3>I am Authenticated</h3>
            </li>
            <li>
              <PureSignOutButton />
            </li>
          </div>

        }

        
        {/// If Not Authenticated
          !props.authenticated &&

          <li>
            <Link to={props.routes.LOGIN}>Login</Link>
            <h3>I am not authenticated</h3>
          </li>

        }
      </ul>
    </div>

  );

}