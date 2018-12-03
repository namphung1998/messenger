import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// const mutation = gql`
//   mutation {
//     c
//   }
// `;

class ChatCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>New Chat!</h1>
        <form onSubmit={this.onSubmit}>
          <label>Name</label>
          <input type='text' value={this.state.value} onChange={(e) => this.setState({ name: e.target.value })}/>
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default ChatCreate;