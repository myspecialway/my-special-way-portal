import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeSlot } from '../../../models/timeslot.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { Class } from '../../../models/class.model';
import { ClassDetailsEventParams } from '../class-details.view/class-details.view.component';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="scheduleService.daysLabels"
              [hoursLabels]="scheduleService.hoursLabels"
              [name]="_class && _class.name ? _class.name : null"
              [level]="_class && _class.level ? _class.level : null"
              [levels]="scheduleService.levels"
              (timeslotClicked)="onTimeSlotClick($event)"
              (detailChanged)="onDetailChange($event)"
            >
            </app-class-details-view>
  `,
})
export class ClassDetailsContainerComponent implements OnInit {
  schedule: TimeSlot[][];
  _class: Class;
  isNew: boolean;
  idOrNew: string;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public scheduleService: ScheduleService,
    private location: Location,
  ) {}

  async ngOnInit() {
    try {
      this.idOrNew = this.route.snapshot.params.idOrNew;
      this.isNew = this.idOrNew === '_new_';
      this._class = this.isNew
        ? new Class()
        : await this.classService.classById(this.idOrNew);
      this.initSchedule();
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  private initSchedule() {
    const schedule = this._class.schedule || [];
    this.schedule = this.scheduleService.buildScheduleFromTimeslots(
      this.scheduleService.hoursLabels.length,
      this.scheduleService.daysLabels.length,
      schedule,
    );
  }

  onTimeSlotClick(indexes: TimeSlotIndexes) {
    if (!this._class._id) {
      return;
    }
    const { hourIndex, dayIndex } = indexes;
    const dialogData = {
      index: `${hourIndex}${dayIndex}`,
      lesson: this.schedule[hourIndex][dayIndex].lesson,
      location: this.schedule[hourIndex][dayIndex].location,
      hour: this.scheduleService.hoursLabels[hourIndex],
      day: this.scheduleService.daysLabels[dayIndex],
    } as ScheduleDialogData;

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: dialogData,
      height: '375px',
      width: '320px',
    });
    dialogRef.afterClosed().subscribe((data: ScheduleDialogData) => {
      if (!data) {
        return;
      }

      const tempClass: Class = {
        _id: this._class._id,
        name: this._class.name,
        level: this._class.level,
        number: this._class.number,
        schedule: [
          { index: data.index, lesson: data.lesson, location: data.location },
        ],
      };

      this.classService
        .update(tempClass)
        .then((res) => {
          this._class = res;
          this.initSchedule();
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    });
  }

  onDetailChange(params: ClassDetailsEventParams) {
    if (!this.isNew) {
      return this.updateClass(params.name, params.level);
    }
    if (params.name.length && params.level.length) {
      this.createClass(params);
    }
  }

  private async updateClass(name: string, level: string) {
    try {
      const tempClass: Class = {
        _id: this._class._id,
        name,
        level,
        number: this._class.number,
        schedule: this._class.schedule,
      };
      this._class = await this.classService.update(tempClass);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  private async createClass(params: ClassDetailsEventParams) {
    try {
      const { name, level } = params;
      const number = 1; // TODO: remove this from server to
      const created = await this.classService.create({
        name,
        level,
        number,
      } as Class);
      this._class._id = created._id;
      this._class.name = name;
      this._class.level = level;
      this._class.number = number; // TODO: remove this
      this.location.replaceState(`/class/${created._id}`);
      this.idOrNew = created.id;
      this.isNew = false;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}
