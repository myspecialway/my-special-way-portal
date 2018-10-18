import gql from 'graphql-tag';

export const QUERY_GET_ALL_LABELS = gql`
  query getAllLabels {
    labels {
      _id
      type
      index
      text
    }
  }
`;

export const QUERY_GET_LABELS_BY_TYPE = gql`
  query getLabelsByType($type: LabelType!) {
    labelsByType(type: $type) {
      _id
      index
      type
      text
    }
  }
`;
