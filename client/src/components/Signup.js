import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import mutation from '../mutations/signup';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    }
  }


  onSubmit = (event) => {
    event.preventDefault();

    this.props.mutate({
      variables: {
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      }
    })
      .then(({ data }) => {
        localStorage.setItem('token', data.signup);
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("submitted");
  }

  render() {
    return (
      <div>
        <h2>Sign up here!</h2>
        <form onSubmit={this.onSubmit}>
          <label>Name</label>
          <input type='text' value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })}/>
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

export default graphql(mutation)(Signup);