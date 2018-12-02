import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';

import UserList from './components/UserList';
import Welcome from './components/Welcome';
import Signin from './components/Signin';
import Signup from './components/Signup';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})


ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App>
        <h1>Messenger</h1>
        <Route path='/' exact component={Welcome}/>
        <Route path='/signin' component={Signin}/>
        <Route path='/signup' component={Signup}/>
      </App>
    </BrowserRouter>
  </ApolloProvider>,
  document.querySelector('#root')
);