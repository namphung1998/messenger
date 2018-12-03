import React, { Component } from 'react';

import { graphql } from 'react-apollo';

import query from '../queries/me';

class TestComponent extends Component {
  render() {
    console.log(this.props.data);
    if (this.props.data.loading) return <h1>Loading...</h1>;

    return (
      <h1>{this.props.data.me.name}</h1>
    );
  }
}

export default graphql(query)(TestComponent);