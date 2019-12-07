import React, { Component } from 'react';
import { withFirebase } from '../backend/firebase';

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
      .fsThreadByUser(this.props.userUid)
      .get()
      .then(
        snapshot => {

          let x = snapshot.docs.map(doc => doc.data())
          this.setState({
            threads: x,
            loading: false

          })
        }
      )
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
          <li key={thread.uid}>
            <span>
              <strong>ID:</strong> {thread.id}
            </span>
            <span>
              <strong>Headline:</strong> {thread.headline}
            </span>
            <span>
              <strong>Price:</strong> {thread.price}
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
