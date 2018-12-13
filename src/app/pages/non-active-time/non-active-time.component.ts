import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { NonActiveTime } from '../../models/non-active-time.model';
import { first } from 'rxjs/operators';
import { DeleteNonActiveTimeDialogueComponent } from './delete/delete-non-active-time-dialogue.component';

@Component({
  selector: 'app-non-active-time',
  templateUrl: './non-active-time.component.html',
  styleUrls: ['./non-active-time.component.scss'],
})
export class NonActiveTimeComponent implements OnInit {
  displayedColumns = ['title', 'classes', 'dates', 'hours', 'deleteNonActiveTime'];
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

  getHoursDisplayData(row: NonActiveTime): string {
    if (row.isAllDayEvent) return 'כל היום';
    const startDateTime = new Date(row.startDateTime);
    const endDateTime = new Date(row.endDateTime);
    const options = { hour: 'numeric', minute: 'numeric' };
    return (
      startDateTime.toLocaleTimeString('he-IL', options) + ' עד ' + endDateTime.toLocaleTimeString('he-IL', options)
    );
  }
}
