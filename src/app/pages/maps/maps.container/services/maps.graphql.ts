import gql from 'graphql-tag';

export const QUERY_GET_ALL_BLOCKED_SECTIONS = gql`
  query getAllBlockedSections {
    blockedSections {
      _id
      from
      to
      reason
    }
  }
`;

export const MUTATE_ADD_BLOCKED_SECTION = gql`
  mutation addBlockedSection($blockedSection: InputBlockedSection!) {
    createBlockedSection(blockedSection: $blockedSection) {
      _id
    }
  }
`;
