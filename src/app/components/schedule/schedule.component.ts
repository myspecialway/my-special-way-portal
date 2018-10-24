import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TimeSlot } from '../../models/timeslot.model';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
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

  constructor(private mswSnackbar: MSWSnackbar) {}

  ngOnInit() {
    this.timeSlotClicked.subscribe((val) => {
      if (!val.selectedClassData.class) {
        this.mswSnackbar.displayTimedMessage('כיתה הינו שדה חובה');
        return;
      }
      if (!val.selectedClassData.grade) {
        this.mswSnackbar.displayTimedMessage('שכבה הינו שדה חובה');
        return;
      }
    });
  }
}
