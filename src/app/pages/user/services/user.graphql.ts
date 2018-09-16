import gql from 'graphql-tag';

export const QUERY_GET_ALL_USERS = gql`
{
 users {
  _id
  username
  firstname
  lastname
  email
  role
}
}
`;

export const QUERY_GET_USER_BY_ID = gql`
query getUserById($id: Number!){
  User(id: $id) {
  id
  userName
  firstName
  lastName
  email
  userType
}
}
`;

export const MUTATE_CREATE_USER = gql`
mutation createUser($user: InputUser!) {
  createUser(user: $user) { _id }
}
`;

export const MUTATE_UPDATE_USER = gql`
mutation updateUser ($id: ID!, $user: InputUser!){
  updateUser(id: $id, user: $user) {
    _id
  }
  }
`;

export const MUTATE_DELETE_USER = gql`
mutation deleteUser ($id: ID!) {
  deleteUser(id: $id)
}
`;
