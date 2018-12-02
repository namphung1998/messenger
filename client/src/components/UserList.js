import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
  query {
    users {
      id,
      name
    }
  }
`;

class UserList extends Component {
  renderList() {
    return this.props.data.users.map(item => {
      return <li>{item.name}</li>;
    })
  }

  render() {
    console.log(this.props.data);
    if (this.props.data.loading) return (<div>Loading...</div>);

    return (
      <ul>
        {this.renderList()}
      </ul>
    );
  }
}

export default graphql(query)(UserList);