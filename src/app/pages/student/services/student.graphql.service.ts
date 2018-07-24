import { Injectable } from '@angular/core';
import Student, { StudentsQuery, StudentQuery } from '../../../models/student.model';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CreateStudentResponse } from '../../../models/responses/create-student-response.model';
import { GetStudentsResponse } from '../../../models/responses/get-students-reponse.model';
import { GetStudentResponse } from '../../../models/responses/get-student-reponse.model';
import { DeleteStudentResponse } from '../../../models/responses/delete-student-response.model';
import { UpdateStudentResponse } from '../../../models/responses/update-student-response.model';

@Injectable()
export class StudentService {

  users: Observable<Student[]>;

  constructor(private apollo: Apollo) { }

  async getAllStudents(): Promise<Student[]> {
    const getStudentsResponse = await this.apollo.query({
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

    return (getStudentsResponse.data as GetStudentsResponse).students;
  }

  async getById(id: string): Promise <Student> {
    const getStudentResponse = await this.apollo.query({
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

    return (getStudentResponse.data as GetStudentResponse).student;
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

  async update(student: StudentQuery): Promise<string> {
    const updateStudentResponse = await this.apollo.mutate({
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

    return (updateStudentResponse.data as UpdateStudentResponse).updateStudent._id;
  }

  async delete(id: number): Promise<number> {
    const deleteStudentResponse = await this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteStudent(
          id: "${id}"
        )
    }
    `}).toPromise();

    return (deleteStudentResponse.data as DeleteStudentResponse).deleteStudent;
  }
}
