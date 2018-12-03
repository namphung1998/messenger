import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query User($id: ID!) {
    user(id: $id) {
      chats {
        users {
          id,
          name
        },
        texts {
          content
        }
      }
    }
  }
`;

class MessageList extends Component {
  renderList() {
    this.props.options.user.chats.map((item, i) => {
      const other = item.users.filter(item => item.id !== this.props.id)[0];
      return <li key={i}>{other.name}</li>
    })
  }

  render() {
    console.log(this.props.options);
    if (this.props.options.loading) return <h1>Loading...</h1>;

    return (
      <div>
        <h1>Messages</h1>
        <ul>
          {this.renderList()}
        </ul>
        <button onClick={() => this.props.history.push('/newChat')} className='btn btn-large btn-danger'>New</button>
      </div>
    );
  }
}

const options = props => {
  return { variables: { id: props.id } };
}

export default graphql(query, options)(MessageList);