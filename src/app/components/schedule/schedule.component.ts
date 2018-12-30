import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeSlot } from '../../models/timeslot.model';
import { FormClassData } from '../../models/FormClassData.model';

export interface TimeSlotIndexes {
  hourIndex: number;
  dayIndex: number;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  @Input()
  schedule: TimeSlot[][];
  @Input()
  daysLabels: string[];
  @Input()
  hoursLabels: string[];
  @Input()
  selectedClassData: FormClassData;
  @Output()
  timeSlotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
  @Output()
  timeSlotDeleted: EventEmitter<TimeSlotIndexes> = new EventEmitter();

  ngOnInit() {}

  onTimeSlotDelete(timeSlotIndex: TimeSlotIndexes, event) {
    event.preventDefault();
    event.stopPropagation();
    this.timeSlotDeleted.emit(timeSlotIndex);
  }
}
