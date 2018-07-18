import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Lesson } from '../../../models/lesson.model';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';

@Component({
  selector: 'app-class-details-view',
  templateUrl: './class-details.view.component.html',
  styleUrls: ['./class-details.view.component.scss'],
})
export class ClassDetailsViewComponent {
  @Input() schedule: Lesson[][];
  @Input() daysLabels: string[];
  @Input() hoursLabels: string[];
  @Output()
  timeslotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
}
