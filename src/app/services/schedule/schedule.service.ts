import { Injectable } from '@angular/core';
import { TimeSlot, Original } from '../../models/timeslot.model';
import { DateUtilService } from '../date-utils/date-util.service';

@Injectable()
export class ScheduleService {
  constructor(private dateUtilService: DateUtilService) {}
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
          let location;
          let lesson;
          let original;

          if (timeslot.location) {
            location = timeslot.location;
          }
          if (timeslot.lesson) {
            lesson = timeslot.lesson;
          }
          if (timeslot.original) {
            ({ lesson, location, original } = this.buildScheduleItem(lesson, location, timeslot.original));
          }

          newTimeSlot.location = location;
          newTimeSlot.lesson = lesson;
          newTimeSlot.original = original;
        }
        schedule[hourIndex][dayIndex] = newTimeSlot;
      }
    }

    return schedule;
  }

  private buildScheduleItem(lesson: any, location: any, i_original: Original) {
    //this function revert the state to base state if tempory state expired
    const isExpired = this.dateUtilService.isTemporeryClassTimeExpired(i_original);
    let original;
    if (isExpired) {
      (lesson = i_original.lesson), (location = i_original.location), (original = undefined);
    } else {
      original = i_original;
    }
    return { lesson, location, original };
  }
}
