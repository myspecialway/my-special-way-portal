import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import Student from '../../../models/student.model';

@Injectable()
export class StudentService {
  private readonly API_URL = './mocks/students.json';

  dataChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Student[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllStudents(): void {
    this.httpClient.get<Student[]>(this.API_URL).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  addStudent (student: Student): void {
    this.dialogData = student;
  }

  updateStudent (student: Student): void {
    this.dialogData = student;
  }

  deleteStudent (id: number): void {
    console.log(id);
  }
}
