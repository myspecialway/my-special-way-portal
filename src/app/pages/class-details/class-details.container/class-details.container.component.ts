import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeSlot } from '../../../models/timeslot.model';
import { Lesson } from '../../../models/lesson.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { Class } from '../../../models/class.model';

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
  _class: Class;
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
    // TODO: look for _new_ in the :id param
    const id = this.route.snapshot.params.id;
    this._class = await this.classService.classById(id).then((res) => res.data.classById);
    this.initSchedule();
  }

  private initSchedule() {
    const schedule = this._class.schedule || [];
    this.schedule = this.buildScheduleFromTimeslots(this.hoursLabels.length, this.daysLabels.length, schedule);
  }

  private buildScheduleFromTimeslots(hoursCount: number, daysCount: number, timeslots: TimeSlot[]): Lesson[][] {
    const schedule: Lesson[][] = [];

    for (let hourIndex = 0; hourIndex < hoursCount; hourIndex++) {
      schedule[hourIndex] = new Array(daysCount);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const timeslot = timeslots.find((t) => t.index === `${hourIndex}${dayIndex}`);

        if (timeslot && timeslot.lesson) {
          const {_id, title, icon} = timeslot.lesson;
          schedule[hourIndex][dayIndex] = {_id, title, icon};
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
        // update the ui first?
        // this.schedule[hourIndex][dayIndex] = data.lesson;
        // TODO: need to delete __typename in configuration of apollo / util function
        const tempSchedule = this._class.schedule.map((timeslot: TimeSlot) => {
          const {index} = timeslot;
          if (timeslot.lesson) {
            const {_id: lessonId, title, icon} = timeslot.lesson;
            return {index, lesson: {_id: lessonId, title, icon}};
          } else {
            return timeslot;
          }
        });
        // TODO: need to delete __typename in configuration of apollo / util function
        const {_id, name, level, number} = this._class;
        const tempClass: Class = {
          _id,
          name,
          level,
          number,
          schedule: [...tempSchedule, {index: `${hourIndex}${dayIndex}`, lesson: data.lesson}]};

        // update the class
        this.classService.update(tempClass).then((res) => {
          if (res.data) {
            this._class = res.data.updateClass;
            this.initSchedule();
          }
        });
      } else {
        return;
      }
    });
  }
}
