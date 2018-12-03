import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import query from '../queries/me';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      console.log(this.props.data);
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      if (!localStorage.getItem('token')) {
        this.props.history.push('/signin');
      }
    }

    render() {
      return <ChildComponent {...this.props} user={this.props.data.me} />
    }
  }

  return graphql(query)(ComposedComponent);
}