import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import * as _ from 'lodash';
import { StudentService } from './services/student.graphql.service';
import { AddStudentDialogComponent } from './dialogs/add/add-student.dialog';
import Student from '../../models/student.model';
import { UpdateStudentDialogComponent } from './dialogs/update/update-student.dialog';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, AfterViewInit {

  displayedColumns = ['studentName', 'gradeId', 'userName', 'personalArea', 'editDetails', 'deleteUser'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;

  constructor(
    private studentService: StudentService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.studentService.getAllStudents();
        }),
        map((data) => {
          return data.data.students;
        }),
        catchError((err) => {
          console.log(err);
          return observableOf([]);
        }),
    ).subscribe((data) => this.dataSource.data = [...data]);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addNewStudent() {
    const dialogRef = this.dialog.open(AddStudentDialogComponent, {
      data: { student: Student },
      height: '600px',
      width: '350px',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const newStudent: Student = this._createNewStudent(data);
        this.studentService.create(newStudent)
          .then(() => {
            this.dataSource.data.push(newStudent);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }

  deleteStudent(id: number, firstName: string, lastName: string, gradeId: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: {id, firstName, lastName, gradeId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.studentService.delete(id)
        .then(() => {
          const index = _.findIndex(this.dataSource.data, (user) => user.id === id );
          this.dataSource.data.splice(index, 1);
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }

  updateStudent(id: number, firstName: string, lastName: string, gender: string, grade: string, userName: string, password: string) {
    const dialogRef = this.dialog.open(UpdateStudentDialogComponent, {
      data: {firstName, lastName, gender, grade, userName, password },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const relevantStudent = _.find(this.dataSource.data, {id});
        const tempStudent = _.assign({}, relevantStudent, result);

        this.studentService.update(tempStudent)
          .then((data) => {
            const index = _.findIndex(this.dataSource.data, (student) => student.id === id);
            this.dataSource.data[index] = _.assign({}, relevantStudent, result);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }

  _createNewStudent(userData: any): Student {
    const student: Student = new Student();
    student.id = 0;
    student.firstName = userData.firstName;
    student.lastName = userData.lastName;
    student.userName = userData.userName;
    student.class = userData.Class;
    return student;
  }
}
