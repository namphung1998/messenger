import gql from 'graphql-tag';

export default gql`
  mutation SignIn($email: String, $password: String) {
    signin(email: $email, password: $password) 
  }
`;