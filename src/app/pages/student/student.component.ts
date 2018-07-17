import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import * as _ from 'lodash';
import { StudentService } from './services/student.graphql.service';
import Student from '../../models/student.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit, AfterViewInit {

  displayedColumns = ['studentName', 'gradeId', 'username', 'personalArea', 'editDetails', 'deleteUser'];
  dataSource = new MatTableDataSource<Student>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: ElementRef;

  constructor(
    private studentService: StudentService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.populateDatasource();
    this.paginator.pageIndex = 0;
    this.dataSource.sort = this.sort;
  }

  populateDatasource() {
    this.studentService.getAllStudents().then((students) => {
      this.dataSource.data = students.data.students;
    }, (err) => {
      console.log('Failed to get list of students !!!', err);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  deleteStudent(id: number, firstName: string, lastName: string, gradeId: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: { id, firstName, lastName, gradeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.studentService.delete(id)
          .then(() => {
            const index = _.findIndex(this.dataSource.data, (user) => user._id === id);
            this.dataSource.data.splice(index, 1);
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }

}
