import gql from 'graphql-tag';

export const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile($userProfile: UserProfile) {
    updateUserProfile(userProfile: $userProfile) @client
  }
`;
