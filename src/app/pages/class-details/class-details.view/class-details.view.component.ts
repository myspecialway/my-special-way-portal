import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { TimeSlot } from '../../../models/timeslot.model';

export interface ClassDetailsEventParams {
  name: string;
  level: string;
}

@Component({
  selector: 'app-class-details-view',
  templateUrl: './class-details.view.component.html',
  styleUrls: ['./class-details.view.component.scss'],
})
export class ClassDetailsViewComponent {
  private _name: string;
  private _level: string;
  @Input() schedule: TimeSlot[][];
  @Input() daysLabels: string[];
  @Input() hoursLabels: string[];
  @Input()
  set name(name: string) {
    this._name = name || '';
  }
  get name(): string {
    return this._name;
  }
  @Input()
  set level(level: string) {
    this._level = level || '';
  }
  get level(): string {
    return this._level;
  }
  @Input() levels: string[];
  @Output() timeslotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
  @Output() detailChanged: EventEmitter<ClassDetailsEventParams> = new EventEmitter();
}
