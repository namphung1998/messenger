import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import UserList from './components/UserList';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App>
      <h1>Messenger</h1>
      <UserList/>
    </App>
  </ApolloProvider>,
  document.querySelector('#root')
);