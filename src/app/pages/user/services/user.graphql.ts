import gql from 'graphql-tag';

export const QUERY_GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      _id
      username
      firstname
      lastname
      email
      role
      class {
        name
        _id
      }
    }
  }
`;

export const QUERY_GET_USER_BY_ID = gql`
  query getUserById($id: Number!) {
    User(id: $id) {
      id
      userName
      firstName
      lastName
      email
      userType
      class {
        name
        _id
      }
    }
  }
`;

export const QUERY_GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    User(email: $email) {
      id
      userName
      firstName
      lastName
      email
      userType
      class {
        name
        _id
      }
    }
  }
`;

export const MUTATE_CREATE_USER = gql`
  mutation createUser($user: InputUser!) {
    createUser(user: $user) {
      _id
    }
  }
`;

export const MUTATE_UPDATE_USER = gql`
  mutation updateUser($id: ID!, $user: InputUser!) {
    updateUser(id: $id, user: $user) {
      _id
    }
  }
`;

export const MUTATE_DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const MUTATE_UPDATE_USER_PASSWORD = gql`
  mutation updateUserPassword($username: String!, $password: String!) {
    updateUserPassword(username: $username, password: $password) {
      _id
    }
  }
`;

export const MUTATE_USER_FORGET_PASSWORD = gql`
  mutation userForgetPassword($username: String!) {
    userForgetPassword(username: $username) {
      _id
    }
  }
`;
