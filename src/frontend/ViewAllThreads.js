import React, { Component } from 'react';
import {} from '../backend/firebase';
import { withAuthorization, AuthUserContext } from '../backend/session';

class ViewAllThreadsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      threads: [],
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.threads().on('value', snapshot => {

      const threadsObject = snapshot.val();
      const threadsList = Object.keys(threadsObject).map(key => ({

        //map everything from threadsObject into a list
        ...threadsObject[key],

        //note what the key is.  i.e. for /threads it is id.  e.g. for /users it is uid.
        uid: key,
      }));

      this.setState({
        threads: threadsList,
        loading: false,
      });
    });
  }
  componentWillUnmount() {
    this.props.firebase.threads().off();
  }

  render() {
    const { threads, loading } = this.state;

    return (

      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>ViewAllThreads</h1>
            {loading && <div>Loading ...</div>}
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
      <li key={thread.uid}>
        <span>
          <strong>ID:</strong> {thread.uid}
        </span>
        <span>
          <strong>Headline:</strong> {thread.headline}
        </span>
        <span>
          <strong>Price:</strong> {thread.price}
        </span>
      </li>
    ))}
  </ul>
);

// This is public currently but let's keep the option of having it protected
// So set authUser => true

const condition = authUser => true; //!!authUser;

export default withAuthorization(condition)(ViewAllThreadsPage);
