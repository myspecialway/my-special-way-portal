import { first } from 'rxjs/operators';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ClassService } from './services/class.graphql.service';
import { Class } from '../../models/class.model';
import { ScheduleService } from '../../services/schedule/schedule.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { DeleteClassDialogComponent } from './dialogs/delete/delete-class.dialog';
import { Router } from '@angular/router';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';

@Component({
  selector: 'app-grade',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  displayedColumns = ['name', 'grade', 'deleteClass'];
  dataSource = new MatTableDataSource<Class>();
  resultsLength = 0;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private classService: ClassService,
    public dialog: MatDialog,
    public scheduleService: ScheduleService,
    private mswSnackbar: MSWSnackbar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.populateDatasource();
    this.dataSource.sort = this.sort;
  }

  private populateDatasource() {
    try {
      this.subCollector.add(
        this.classService.getAllClasses().subscribe((classes) => {
          this.dataSource.data = [...classes];
        }),
      );
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  deleteClass(_id: string, name: string, grade: string, numberOfStudents: number) {
    if (numberOfStudents > 0) {
      this.mswSnackbar.displayTimedMessage('לא ניתן למחוק את הכיתה כיוון שיש תלמידים המשוייכים אליה');
    } else {
      const dialogRef = this.dialog.open(DeleteClassDialogComponent, {
        data: { _id, name, grade },
      });
      this.subCollector.add(
        dialogRef
          .afterClosed()
          .pipe(first())
          .subscribe(async (result) => {
            if (result === true) {
              await this.classService.delete(_id);
            }
          }),
      );
    }
  }

  navigate(row_id: string) {
    this.router.navigate(['/class', row_id]);
  }
}
