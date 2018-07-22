import { Injectable } from '@angular/core';
import Student, { StudentsQuery, StudentQuery } from '../../../models/student.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CreateStudentResponse } from '../../../models/responses/create-student-response.model';

@Injectable()
export class StudentService {

  users: Observable<Student[]>;

  constructor(private apollo: Apollo) { }

  getAllStudents() {
    return this.apollo.query<StudentsQuery>({
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
    return this.apollo.query<Student>({
      query: gql`
        {
          student(id:"${id}") {
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

  async create(student: Student): Promise<string> {
    const createStudentResponse = await this.apollo.mutate({
      mutation: gql`
      mutation {
        createStudent(student: {
            username: "${student.username}"
            password: "${student.password}"
            firstname: "${student.firstname}"
            lastname: "${student.lastname}"
            gender: ${student.gender}
            class_id: "${student.class._id}"
            }) { _id }
        }
    `}).toPromise();

    return (createStudentResponse.data as CreateStudentResponse).createStudent._id;
  }

  update(student: StudentQuery) {
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
            class_id: "${student.class_id}"
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
