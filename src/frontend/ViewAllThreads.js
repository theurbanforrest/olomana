import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {} from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';


class ViewAllThreadsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      threads: [],
      error: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .fsThreads()
      .get()
      .then(
        querySnapshot => {

          //Firestore is unable to get us the path as part of .data()
          //So we need to get it ourselves

          let DocsArray = [];
          for(let i=0;i<querySnapshot.docs.length;i++){

            let x = {};

            x.path = querySnapshot.docs[i].id;
            x.data = querySnapshot.docs[i].data();

            DocsArray.push(x);

          }

          return DocsArray;
        
          /*** This is the query to get all the doc data WITHOUT path
          //much simpler but it does not satisfy the reqs

          return querySnapshot.docs.map(
            doc => doc.data())

          */
          
        }
      )
      .then( s => {

        this.setState({
            threads: s,
            loading: false

          })

        /*** useful debugger message
          alert('this.state is now ' + JSON.stringify(this.state));
        ***/

      })
      .catch(
        err => {
          this.setState({error: err})
        }
      )
  }
  componentWillUnmount() {
    ///
  }

  render() {
    const { error, threads, loading } = this.state;

    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>ViewAllThreads</h1>
            {loading && <div>Loading ...</div>}
            {error && error.message}
            <ThreadList threads={threads} />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const ThreadList = ({ threads }) => (
  <ul>
    {threads.map(thread => (
      <li key={thread.price}>
        <span>
          <strong>Path:</strong> {thread.path}
        </span>
        <span>
          <strong>Headline:</strong> {thread.data.headline}
        </span>
        <span>
          <strong>Price:</strong> {thread.data.price}
        </span>
        <span>
          <Link to={`thread/${thread.path}`}> View </Link>
        </span>
      </li>
    ))}
  </ul>
);

// This is public currently but let's keep the option of having it protected
// So set authUser => true

const condition = authUser => true; //!!authUser;
export default withAuthorization(condition)(ViewAllThreadsPage);
