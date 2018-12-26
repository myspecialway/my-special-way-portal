import gql from 'graphql-tag';

export const QUERY_GET_SETTINGS = gql`
  query getAllSettings {
    settings {
      _id
      teachercode
    }
  }
`;

export const MUTATE_UPDATE_SETTINGS = gql`
  mutation updateSettings($id: ID!, $settings: InputSettings!) {
    updateSettings(id: $id, settings: $settings) {
      teachercode
    }
  }
`;
