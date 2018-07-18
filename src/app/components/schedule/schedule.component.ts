import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lesson } from '../../models/lesson.model';

export interface TimeSlotIndexes {
  hourIndex: number;
  dayIndex: number;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent {

  @Input()
  schedule: Lesson[][];
  @Input()
  daysLabels: string[];
  @Input()
  hoursLabels: string[];

  @Output()
  timeSlotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
}
