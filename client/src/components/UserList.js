import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import requireAuth from './requireAuth';
import MessageList from './MessageList';

import mutation from '../mutations/logout';

const query = gql`
  query {
    me {
      id,
      name
    },
    users {
      name
    }
  }
`;

class UserList extends Component {
  renderList() {
    return this.props.data.users.map((item, i) => {
      return <li key={i}>{item.name}</li>;
    });
  }

  onLogout = () => {
    this.props.mutate()
      .then(() => {
        localStorage.removeItem('token');
        this.props.history.push('/signin');
      });
  }

  render() {
    console.log(this.props.data);

    if (this.props.data.loading) return (<div>Loading...</div>);

    return (
      <div>
        <h1>Welcome {this.props.data.me.name}</h1>
        <button onClick={this.onLogout} className='btn btn-large btn-success'>Log out</button>
        <MessageList history={this.props.history} id={this.props.data.me.id} />
      </div>
    );
  }
}

export default requireAuth(
  graphql(query)(
    graphql(mutation)(UserList)
  )
);