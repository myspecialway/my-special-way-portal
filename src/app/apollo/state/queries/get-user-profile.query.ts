import gql from 'graphql-tag';

export const GET_USER_PROFILE = gql`
  query {
    userProfile @client{
      username
      role
    }
  }
`;
