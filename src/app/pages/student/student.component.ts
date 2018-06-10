import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { StudentService } from './services/student.service';
import { merge } from 'rxjs/observable/merge';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { of as observableOf } from 'rxjs/observable/of';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import * as _ from 'lodash';

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
    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       if (this.studentService !== undefined) {
    //         return this.studentService.getAllStudents();
    //       }
    //     }),
    //     map((data) => {
    //       return data.data.allStudents;
    //     }),
    //     catchError(() => {
    //       return observableOf([]);
    //     }),
    // ).subscribe((data) => this.dataSource.data = [...data]);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteStudent(id: number, firstName: string, lastName: string, gradeId: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: {id: id, firstName: firstName, lastName: lastName, gradeId: gradeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const index = _.findIndex(this.dataSource.data, function(user) { return user.id == id })
        this.dataSource.data.splice(index,1);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
}
