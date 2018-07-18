import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeSlot } from '../../../models/timeslot.model';
import { Lesson } from '../../../models/lesson.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="daysLabels"
              [hoursLabels]="hoursLabels" (timeslotClicked)="onTimeSlotClick($event)"></app-class-details-view>
  `,
})
export class ClassDetailsContainerComponent implements OnInit {
  schedule: Lesson[][];

  readonly daysLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  readonly hoursLabels = [
    '07:30 - 08:00',
    '08:00 - 08:50',
    '08:50 - 09:35',
    '09:35 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:15',
    '11:15 - 12:00',
    '12:00 - 12:45',
    '12:45 - 13:15',
    '13:15 - 13:45',
    '13:45 - 14:30',
    '14:30 - 15:15',
    '15:15 - 16:00',
    '16:00 - 16:30',
    '16:30 - 16:45',
  ];
  constructor(private classService: ClassService, private route: ActivatedRoute, public dialog: MatDialog) { }

  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    if (!id) {
      return;
    }
    // TODO: fix any typing
    const classData: any = await this.classService.classById(id).then((res) => res.data.classById);
    const schedule = classData.schedule || [];
    this.schedule = this.buildScheduleFromTimeslots(this.hoursLabels.length, this.daysLabels.length, schedule);
  }

  buildScheduleFromTimeslots(hoursCount: number, daysCount: number, timeslots: TimeSlot[]): Lesson[][] {
    const schedule: Lesson[][] = [];

    for (let hourIndex = 0; hourIndex < hoursCount; hourIndex++) {
      schedule[hourIndex] = new Array(daysCount);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const timeslot = timeslots.find((t) => t.index === `${hourIndex}${dayIndex}`);

        if (timeslot && timeslot.lesson) {
          schedule[hourIndex][dayIndex] = timeslot.lesson;
        }
      }
    }

    return schedule;
  }

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
      } else {
        return;
      }
    });
  }
}
