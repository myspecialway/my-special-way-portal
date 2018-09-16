import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClassService } from './services/class.graphql.service';
import { Class } from '../../models/class.model';
import * as _ from 'lodash';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { DeleteClassDialogComponent } from './dialogs/delete/delete-class.dialog';

@Component({
  selector: 'app-grade',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  displayedColumns = ['classname', 'level', 'editDetails', 'deleteClass'];
  dataSource = new MatTableDataSource<Class>();
  resultsLength = 0;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  constructor(
    private classService: ClassService,
    public dialog: MatDialog,
    public scheduleService: ScheduleService,
    private mswSnackbar: MSWSnackbar,
  ) {}

  async ngOnInit() {
    await this.populateDatasource();
    this.dataSource.sort = this.sort;
  }

  private async populateDatasource() {
    try {
      this.dataSource.data = await this.classService.getAllClasses();
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  deleteClass(_id: string, name: string, level: string, numberOfStudents: number) {
    if (numberOfStudents > 0) {
      this.mswSnackbar.displayTimedMessage('לא ניתן למחוק את הכיתה כיוון שיש תלמידים המשוייכים אליה');
    } else {
      const dialogRef = this.dialog.open(DeleteClassDialogComponent, {
        data: { _id, name, level },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.classService.delete(_id).then(res => {
            if (res && res.data && res.data.deleteClass !== 0) {
              const index = _.findIndex(this.dataSource.data, user => user._id === _id);
              this.dataSource.data.splice(index, 1);
            }
          });
        }
      });
    }
  }

  // editClass(_id: string, name: string, level: string) {
  //   const dialogRef = this.dialog.open(UpdateClassDialogComponent, {
  //     data: {_id, name, level},
  //     height: '310px',
  //     width: '320px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       const relevantClass = _.find(this.dataSource.data, {_id});
  //       const tempClass = _.assign({}, relevantClass, result);

  //       this.classService.update(tempClass)
  //         .then((data) => {
  //           const index = _.findIndex(this.dataSource.data, (user) => user._id === _id);
  //           this.dataSource.data[index] = _.assign({}, relevantClass, result);
  //         });
  //     }
  //   });
  // }

  _createNewClass(classData: any): Class {
    const _class: Class = new Class();
    _class.name = classData.name;
    _class.grade = classData.grade;
    return _class;
  }
}
