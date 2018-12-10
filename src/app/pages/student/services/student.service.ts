import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators/map';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import {
  QUERY_GET_ALL_STUDENTS,
  QUERY_GET_STUDENT_BY_ID,
  MUTATE_ADD_STUDENT,
  MUTATE_UPDATE_STUDENT,
  MUTATE_DELETE_STUDENT,
  MUTATE_ADD_STUDENTS,
} from './student.graphql';
import Student, { StudentQuery } from '../../../models/student.model';
import { DeleteStudentResponse } from '../../../models/responses/delete-student-response.model';
import { UpdateStudentResponse } from '../../../models/responses/update-student-response.model';
import { StudentError } from '../../../file-import/students-file-import/students-file-import.service';
import { ErrorDetails } from '../../common/error-dialog/error.dialog';

@Injectable()
export class StudentService {
  constructor(private apollo: Apollo) {}

  getAllStudents() {
    return this.apollo
      .watchQuery<{ students: Student[] }>({
        query: QUERY_GET_ALL_STUDENTS,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data.students;
        }),
        catchError((err: TypeError) => {
          console.warn('user.component::ngInInit:: empty stream recieved');
          return observableOf([]);
        }),
      );
  }

  getById(id: string) {
    return this.apollo
      .query<{ student: Student }>({
        query: QUERY_GET_STUDENT_BY_ID,
        variables: { id },
      })
      .pipe(map((res) => res.data.student))
      .toPromise();
  }

  create(student: Student) {
    return this.apollo
      .mutate({
        mutation: MUTATE_ADD_STUDENT,
        variables: { student: { ...student, class: undefined, class_id: student.class._id } },
        refetchQueries: [{ query: QUERY_GET_ALL_STUDENTS }],
      })
      .toPromise();
  }

  createMany(students: Student[]) {
    return this.apollo
      .mutate({
        mutation: MUTATE_ADD_STUDENTS,
        variables: {
          students: students.map((student) => ({ ...student, class: undefined, class_id: student.class._id })),
        },
        refetchQueries: [{ query: QUERY_GET_ALL_STUDENTS }],
      })
      .toPromise();
  }

  update(student: StudentQuery): Promise<string> {
    return this.apollo
      .mutate({
        mutation: MUTATE_UPDATE_STUDENT,
        variables: { id: student._id, student: { ...student, _id: undefined } },
        refetchQueries: [{ query: QUERY_GET_STUDENT_BY_ID, variables: { id: student._id } }],
        awaitRefetchQueries: true,
      })
      .pipe(map((res: { data: UpdateStudentResponse }) => res.data.updateStudent._id))
      .toPromise() as Promise<string>;
  }

  delete(id: number) {
    return this.apollo
      .mutate({
        mutation: MUTATE_DELETE_STUDENT,
        variables: { id },
        refetchQueries: [{ query: QUERY_GET_ALL_STUDENTS }],
      })
      .pipe(map((res: { data: DeleteStudentResponse }) => res.data.deleteStudent))
      .toPromise();
  }

  buildErrorMessage(studentsFileErrors: StudentError[]): ErrorDetails {
    const details: string[] = [];
    for (const rowError of studentsFileErrors) {
      let detailsStr = `שורה ${rowError.index + 1} - `;
      for (const field of rowError.fields) {
        detailsStr += `${field}, `;
      }
      detailsStr = detailsStr.slice(0, -2);
      details.push(detailsStr);
    }
    return { title: 'קובץ לא תקין', details, bottomline: 'אנא תקן את הקובץ ונסה שנית.' };
  }
}
