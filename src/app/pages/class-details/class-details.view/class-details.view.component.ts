import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Lesson } from '../../../models/lesson.model';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { Class } from '../../../models/class.model';

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
  private canedit = true; // TBD depends on the user role
  @Input() schedule: Lesson[][];
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
  @Input() classModel: Class;
  @Output() timeslotClicked: EventEmitter<TimeSlotIndexes> = new EventEmitter();
  @Output() detailChanged: EventEmitter<ClassDetailsEventParams> = new EventEmitter();
}
