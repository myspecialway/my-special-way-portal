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
import { Router } from '@angular/router';

@Component({
  selector: 'app-grade',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  displayedColumns = ['classname', 'level', 'deleteClass'];
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
    private router: Router,
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

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.classService.delete(_id).then((res) => {
            if (res && res.data && res.data.deleteClass !== 0) {
              const index = _.findIndex(this.dataSource.data, (user) => user._id === _id);
              this.dataSource.data.splice(index, 1);
            }
          });
        }
      });
    }
  }

  navigate(row_id: string) {
    this.router.navigate(['/class', row_id]);
  }
}
