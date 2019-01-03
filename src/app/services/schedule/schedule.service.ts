import { Injectable } from '@angular/core';
import { TimeSlot } from '../../models/timeslot.model';

@Injectable()
export class ScheduleService {
  constructor() {}
  grades = {
    a: 'א',
    b: 'ב',
    c: 'ג',
    d: 'ד',
    e: 'ה',
    f: 'ו',
  };
  daysLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
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
          if (timeslot.original) {
            newTimeSlot.original = timeslot.original;
          }
        }
        schedule[hourIndex][dayIndex] = newTimeSlot;
      }
    }

    return schedule;
  }
}
