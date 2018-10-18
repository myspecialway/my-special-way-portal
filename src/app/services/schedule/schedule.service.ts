import { LabelType, Label } from './../../models/label.model';
import { LabelsService } from './../label/label.graphql.service';
import { Injectable } from '@angular/core';
import { TimeSlot } from '../../models/timeslot.model';

@Injectable()
export class ScheduleService {
  grades = {
    a: 'א',
    b: 'ב',
    c: 'ג',
    d: 'ד',
    e: 'ה',
    f: 'ו',
  };
  daysLabels = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  hoursLabels: string[];

  constructor(private labelsService: LabelsService) {
    this.getHoursLabels();
  }

  getHoursLabels() {
    this.labelsService.getLabelsByType(LabelType.CLASS_HOURS).then((data) => {
      const labels: Label[] = [...data.data.labelsByType];
      labels.sort((a, b) => (a.index || 0) - (b.index || 0));
      this.hoursLabels = labels.map((label) => label.text);
    });
  }

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
