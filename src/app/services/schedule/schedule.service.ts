import { Injectable } from '@angular/core';
import { TimeSlot } from '../../models/timeslot.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ScheduleService {
  constructor(translate: TranslateService) {
    translate.get(this.daysLabels).subscribe((days) => {
      this.daysLabels.forEach((item, index) => {
        this.daysLabels[index] = days[item];
      });
    });
    translate.get(Object.values(this.grades)).subscribe((grades) => {
      Object.keys(this.grades).forEach((key) => {
        this.grades[key] = grades[this.grades[key]];
      });
    });
  }

  grades = {
    a: 'GRADES.A',
    b: 'GRADES.B',
    c: 'GRADES.C',
    d: 'GRADES.D',
    e: 'GRADES.E',
    f: 'GRADES.F',
  };
  daysLabels = ['DAYS.SUNDAY', 'DAYS.MONDAY', 'DAYS.TUESDAY', 'DAYS.WEDNESDAY', 'DAYS.THURSDAY', 'DAYS.FRIDAY'];
  hoursLabels = [
    '07:30 - 08:00',
    '08:00 - 08:50',
    '08:50 - 09:30',
    '09:30 - 10:00',
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

  buildScheduleFromTimeslots(hoursCount: number, daysCount: number, timeslots: TimeSlot[]): TimeSlot[][] {
    const schedule: TimeSlot[][] = [];

    for (let hourIndex = 0; hourIndex < hoursCount; hourIndex++) {
      schedule[hourIndex] = new Array(daysCount);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const timeslot = timeslots.find((t) => t.index === `${hourIndex}_${dayIndex}`);
        const newTimeSlot: TimeSlot = {
          index: `${hourIndex}_${dayIndex}`,
        };
        if (timeslot) {
          if (timeslot.location) {
            newTimeSlot.location = timeslot.location;
          }
          if (timeslot.lesson) {
            newTimeSlot.lesson = timeslot.lesson;
          }
        }
        schedule[hourIndex][dayIndex] = newTimeSlot;
      }
    }

    return schedule;
  }
}
