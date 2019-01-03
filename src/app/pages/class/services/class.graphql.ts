import gql from 'graphql-tag';

export const GET_ALL_CLASSES = gql`
  {
    classes {
      _id
      grade
      name
      schedule {
        lesson {
          _id
          title
        }
      }
      students {
        _id
        firstname
      }
    }
  }
`;

// TODO: refactor to using gql fragments, but know that it'll raise error related to __typename field that we configured to be emitted
// need to rethink it
export const ALL_CLASS_FIELDS = `
_id
name
grade
schedule {
  index
  hours
  lesson {
    _id
    title
    icon
  }
  location {
    name
    position {
      floor
    }
  }
  original {
    expired
    lesson {
      _id
      title
      icon
    }
    location {
      name
      position {
        floor
      }
    }
  }
}`;

export const QUERY_GET_CLASS_BY_ID = gql`
  query getClassById($id: ID!){
        classById(id: $id) {
          ${ALL_CLASS_FIELDS}
        }
      }`;

export const QUERY_GET_CLASS_BY_NAME = gql`
  query getClassByName($name: String!){
        classByName(name: $name) {
          ${ALL_CLASS_FIELDS}
        }
      }`;

export const MUTATE_UPDATE_CLASS = gql`
    mutation updateClass($id: ID!, $class: InputClass!) {
      updateClass(id: $id, class: $class) {
        ${ALL_CLASS_FIELDS}
      }
    }
  `;

export const DELETE_SCHEDULE_SLOT_FROM_CLASS = gql`
   mutation deleteScheduleSlotFromClass($id: ID!, $scheduleIndex: String!) {
    deleteScheduleSlotFromClass(classId:$id, scheduleIndex:$scheduleIndex) {
      ${ALL_CLASS_FIELDS}
    }
  }
  `;
