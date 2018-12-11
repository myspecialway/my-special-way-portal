import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { NonActiveTime } from '../../models/non-active-time.model';
import { EditLessonDialogComponent } from '../lesson/dialogs/new-edit/edit-lesson.dialog';
import { first } from 'rxjs/operators';
import { DeleteNonActiveTimeDialogueComponent } from './delete/delete-non-active-time-dialogue.component';

@Component({
  selector: 'app-non-active-time',
  templateUrl: './non-active-time.component.html',
  styleUrls: ['./non-active-time.component.scss'],
})
export class NonActiveTimeComponent implements OnInit {
  displayedColumns = ['title', 'classes', 'dates'];
  dataSource = new MatTableDataSource<NonActiveTime>();

  @ViewChild(MatSort)
  sort: MatSort;

  @SubscriptionCleaner()
  subCollector: Subscription;

  constructor(private nonActiveTimeService: NonActiveTimeService, public dialog: MatDialog) {}

  async ngOnInit() {
    try {
      this.subCollector.add(
        this.nonActiveTimeService.getAllNonActiveTimes().subscribe((nonActiveTimes) => {
          if (nonActiveTimes !== null) {
            this.dataSource.data = [...nonActiveTimes];
          } else {
            this.dataSource.data = [];
          }
        }),
      );
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error getting non active times');
      throw error;
    }
  }

  private openNonActiveTimeDialog(data: NonActiveTime) {
    const dialogRef = this.dialog.open(EditLessonDialogComponent, {
      //TODO - change to the right dialogue component
      data,
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result) {
            if (data._id !== '') {
              if (data.classes) {
                this.nonActiveTimeService.update(
                  data._id,
                  data.title,
                  data.isAllDayEvent,
                  data.startDateTime,
                  data.endDateTime,
                  data.isAllClassesEvent,
                  data.classes.map((classObj) => classObj._id),
                );
              } else {
                this.nonActiveTimeService.update(
                  data._id,
                  data.title,
                  data.isAllDayEvent,
                  data.startDateTime,
                  data.endDateTime,
                  data.isAllClassesEvent,
                  undefined,
                );
              }
            } else {
              if (data.classes) {
                this.nonActiveTimeService.create(
                  data.title,
                  data.isAllDayEvent,
                  data.startDateTime,
                  data.endDateTime,
                  data.isAllClassesEvent,
                  data.classes.map((classObj) => classObj._id),
                );
              } else {
                this.nonActiveTimeService.create(
                  data.title,
                  data.isAllDayEvent,
                  data.startDateTime,
                  data.endDateTime,
                  data.isAllClassesEvent,
                  undefined,
                );
              }
            }
          }
        }),
    );
  }

  public addNewNonActiveTime() {
    this.openNonActiveTimeDialog({
      _id: '',
      title: '',
      isAllDayEvent: false,
      startDateTime: '0',
      endDateTime: '0',
      isAllClassesEvent: false,
      classes: [],
    });
  }

  public editNewNonActiveTime(nonActiveTime: NonActiveTime): void {
    this.openNonActiveTimeDialog(JSON.parse(JSON.stringify(nonActiveTime)));
  }

  public async deleteNonActiveTime(nonActiveTime: NonActiveTime) {
    const dialogRef = this.dialog.open(DeleteNonActiveTimeDialogueComponent, {
      data: { _id: nonActiveTime._id, title: nonActiveTime.title },
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result === true) {
            this.nonActiveTimeService.delete(nonActiveTime._id);
          }
        }),
    );
  }

  getClassesDisplayData(row: NonActiveTime): string {
    if (row.isAllClassesEvent) return 'כל הכיתות';
    if (!row.classes) throw new Error('Non active time is marked for specific classes, but no classes were specified');
    if (row.classes.length === 1) return row.classes[0].name;
    return row.classes[0].name + ' + ' + (row.classes.length - 1);
  }

  getDatesDisplayData(row: NonActiveTime): string {
    const startDateTime = new Date(row.startDateTime);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let result: string = startDateTime.toLocaleDateString('he-IL', options);
    if (row.startDateTime !== row.endDateTime) {
      const endDateTime = new Date(row.startDateTime);
      result += ' עד ' + endDateTime.toLocaleDateString('he-IL', options);
    }

    return result;
  }
}
