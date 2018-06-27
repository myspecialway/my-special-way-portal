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
            student: {
            username: "${student.username}"
            password: "${student.password}"
            firstname: "${student.firstname}"
            lastname: "${student.lastname}"
            gender: ${student.gender}
            }) { _id }
        }
    `}).toPromise();
  }

  update(student: Student) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        updateStudent(
            id: "${student._id}",
            student: {
            username: "${student.username}"
            password: "${student.password}"
            firstname: "${student.firstname}"
            lastname: "${student.lastname}"
            gender: ${student.gender}
            }) { _id }
        }
    `}).toPromise();
  }

  delete(id: number) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteStudent(
          id: "${id}"
        )
    }
    `}).toPromise();

  }
}
