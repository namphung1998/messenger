import gql from 'graphql-tag';

export default gql`
  mutation SignUp($email: String, $password: String, $name: String) {
    signup(email: $email, password: $password, name: $name) 
  }
`;