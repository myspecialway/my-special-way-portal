import gql from 'graphql-tag';

export const QUERY_GET_ALL_STUDENTS = gql`
  query getAllStudents {
    students {
      _id
      username
      firstname
      lastname
      gender
      class {
        name
        _id
      }
    }
  }
`;

export const QUERY_GET_STUDENT_BY_ID = gql`
  query getStudentById($id: ID!) {
    student(id: $id) {
      _id
      username
      firstname
      password
      lastname
      gender
      schedule {
        index
        hours
        lesson {
          _id
          title
          icon
        }
        location {
          _id
          name
          location_id
          position {
            floor
          }
          icon
          type
        }
        customized
      }
      class {
        name
        _id
      }
      reminders {
        enabled
        type
        schedule {
          daysindex
          hours
        }
      }
    }
  }
`;

export const MUTATE_ADD_STUDENT = gql`
  mutation addStudent($student: InputStudent!) {
    createStudent(student: $student) {
      _id
    }
  }
`;

export const MUTATE_ADD_STUDENTS = gql`
  mutation addStudents($students: [InputStudent!]!) {
    createStudents(students: $students) {
      _id
    }
  }
`;

export const MUTATE_UPDATE_STUDENT = gql`
  mutation updateStudent($id: ID!, $student: InputStudent!) {
    updateStudent(id: $id, student: $student) {
      _id
    }
  }
`;

export const MUTATE_DELETE_STUDENT = gql`
  mutation deleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;
