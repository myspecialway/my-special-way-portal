import { Injectable } from '@angular/core';
import Student, { StudentQuery } from '../../../models/student.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class StudentService {

  users: Observable<Student[]>;

  constructor(private apollo: Apollo) { }

  getAllStudents() {
    return this.apollo.query<StudentQuery>({
      query: gql`
        {
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
      ` }).toPromise();
  }

  getById(id: number) {
    return this.apollo.query<StudentQuery>({
      query: gql`
        {
          Student(id:${id}) {
          id
          userName
          firstName
          lastName
          gender
        }
      }
      ` }).toPromise();
  }

  create(student: Student) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        createStudent(
            username: "${student.userName}"
            password: "${student.password}"
            firstname: "${student.firstName}"
            lastname: "${student.lastName}"
            gender: "${student.gender}"
            class_id: "${student.class && student.class._id}"
            ) {
          id
        }
        }
    `}).toPromise();
  }

  update(student: Student) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateStudent(
            id: ${student.id}
            userName: "${student.userName}"
            firstName: "${student.firstName}"
            lastName: "${student.lastName}"
            gender: "${student.gender}"
            ) {
          id
        }
        }
    `}).toPromise();
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        removeStudent(id:${id})
    }
    `}).toPromise();

  }
}
