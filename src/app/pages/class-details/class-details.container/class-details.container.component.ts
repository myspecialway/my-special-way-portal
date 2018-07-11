import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../../../models/class.model';
import { Lesson } from '../../../models/lesson.model';
import { scheduleTestData } from '../../../../mocks/assets/schedule.mock';

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="daysLabels"
              [hoursLabels]="hoursLabels"></app-class-details-view>
  `,
})
export class ClassDetailsContainerComponent implements OnInit {
  schedule: Lesson[][];

  private readonly daysLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  private readonly hoursLabels = [
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
  constructor() { }

  ngOnInit() {
    this.schedule = this.buildScheduleFromTimeslots(this.hoursLabels.length, this.daysLabels.length, scheduleTestData);
  }

  buildScheduleFromTimeslots(
    hoursCount: number,
    daysCount: number,
    timeslots: TimeSlot[]): Lesson[][] {
    const schedule: Lesson[][] = [];

    for (let hourIndex = 0; hourIndex < hoursCount; hourIndex++) {
      schedule[hourIndex] = new Array(daysCount);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const timeslot = timeslots.find((t) => t.index === `${hourIndex}${dayIndex}`);

        if (timeslot) {
          schedule[hourIndex][dayIndex] = timeslot.lesson;
        }
      }
    }

    return schedule;
  }
}
