import { Component, Input } from '@angular/core';
import { Lesson } from '../../../models/lesson.model';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { TimeSlot } from '../../../models/timeslot.model';

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
      index: `${hourIndex}${dayIndex}`,
      lesson: this.schedule[hourIndex][dayIndex],
      hour: this.hoursLabels[hourIndex],
      day: this.daysLabels[dayIndex],
    };

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: dialogData,
      height: '375px',
      width: '320px',
    });
    // dialogRef.afterClosed().subscribe((data) => {
    //   if (data) {
    //     const newStudent: Student = this._createNewStudent(data);
    //     this.studentService.create(newStudent)
    //       .then(() => {
    //         this.dataSource.data.push(newStudent);
    //         this.dataSource.paginator = this.paginator;
    //       });
    //   }
    // });
  }
}
