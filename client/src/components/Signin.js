import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import mutation from '../mutations/signin';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: []
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    this.props.mutate({
      variables: {
        email: this.state.email,
        password: this.state.password
      }
    })
    .then(({ data }) => {
      localStorage.setItem('token', data.signup);
      this.props.history.push('/');
    })
    .catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    })

    console.log("submitted");
  }

  render() {
    return (
      <div>
        <h2>Sign in here!</h2>
        <form onSubmit={this.onSubmit}>
          <label>Email</label>
          <input type='email' value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })}/>
          <label>Password</label>
          <input type='password' value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })}/>
          <button>Submit!</button>
        </form>
      </div>
    );
  }
}

export default graphql(mutation)(Signin);