import { Component, Input } from '@angular/core';
import { Lesson } from '../../../models/lesson.model';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';

@Component({
  selector: 'app-class-details-view',
  templateUrl: './class-details.view.component.html',
  styleUrls: ['./class-details.view.component.scss'],
})
export class ClassDetailsViewComponent {
  @Input() schedule: Lesson[][];
  @Input() daysLabels: string[];
  @Input() hoursLabels: string[];

  constructor(public dialog: MatDialog) {}

  onTimeSlotClick(indexes: TimeSlotIndexes) {
    const { hourIndex, dayIndex } = indexes;
    const dialogData = {
      lesson: this.schedule[hourIndex][dayIndex],
      hour: this.hoursLabels[hourIndex],
      day: this.daysLabels[dayIndex],
    } as ScheduleDialogData;

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: dialogData,
      height: '375px',
      width: '320px',
    });
    dialogRef.afterClosed().subscribe((data: ScheduleDialogData) => {
      if (data && data.lesson) {
        this.schedule[hourIndex][dayIndex] = data.lesson;
      }
    });
  }
}
