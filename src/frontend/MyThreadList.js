import React, { Component } from 'react';
import { withFirebase } from '../backend/firebase';
import { Link } from 'react-router-dom';

class MyThreadList extends Component {
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
      .fsThreadsByUser(this.props.userUid)
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
    const { threads, loading, error } = this.state;

    return (

      <ul>
        {loading && <div>Loading ...</div>}
        {threads.map(thread => (
          <li key={thread.path}>
            <span>
              <strong>ID:</strong> {thread.path}
            </span>
            <span>
              <strong>Headline:</strong> {thread.data.headline}
            </span>
            <span>
              <strong>Price:</strong> {thread.data.price}
            </span>
            <span>
              <strong>Status:</strong> {thread.data.status}
            </span>
            <span>
              <Link to={`thread/${thread.path}`}> View </Link>
            </span>
          </li>
        ))}
        {threads.length < 1 && 
          <p> You have no threads. </p>
        }
        {error && <p>{error.message}</p>}
      </ul>
    );
  }
}

// This component does not manage if it's public vs. protected so okay to leave basic
export default withFirebase(MyThreadList);
