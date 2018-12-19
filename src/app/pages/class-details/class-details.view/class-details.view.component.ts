import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { TimeSlot } from '../../../models/timeslot.model';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { FormClassData } from '../../../models/FormClassData.model';

export interface ClassDetailsEventParams {
  name: string;
  grade: string;
}

@Component({
  selector: 'app-class-details-view',
  templateUrl: './class-details.view.component.html',
  styleUrls: ['./class-details.view.component.scss'],
})
export class ClassDetailsViewComponent {
  private _name: string;
  private _grade: string;
  public gradesKeys: string[];
  @Input()
  schedule: TimeSlot[][];
  @Input()
  daysLabels: string[];
  @Input()
  hoursLabels: string[];
  @Input()
  selectedClassData: FormClassData;
  @Input()
  set name(name: string) {
    this._name = name || '';
  }
  get name(): string {
    return this._name;
  }
  @Input()
  set grade(grade: string) {
    this._grade = grade || '';
  }
  get grade(): string {
    return this._grade;
  }
  @Input()
  shouldShowClassInfo: boolean;
  @Output()
  timeslotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
  @Output()
  timeSlotDeleted: EventEmitter<TimeSlotIndexes> = new EventEmitter();
  @Output()
  detailChanged: EventEmitter<ClassDetailsEventParams> = new EventEmitter();

  constructor(protected scheduleService: ScheduleService) {
    this.gradesKeys = Object.keys(this.scheduleService.grades);
  }
}
