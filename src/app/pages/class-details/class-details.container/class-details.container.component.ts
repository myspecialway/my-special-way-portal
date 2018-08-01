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

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="scheduleService.daysLabels"
              [hoursLabels]="scheduleService.hoursLabels"
              [name]="_class ? _class.name : null"
              [level]="_class ? _class.level : null"
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

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public scheduleService: ScheduleService,
  ) {}

  async ngOnInit() {
    // TODO: look for _new_ in the :id param
    const id = this.route.snapshot.params.id;
    this._class = await this.classService
      .classById(id)
      .then((res) => res.data.classById);
    this.initSchedule();
  }

  private initSchedule() {
    const schedule = this._class.schedule || [];
    this.schedule = this.buildScheduleFromTimeslots(
      this.scheduleService.hoursLabels.length,
      this.scheduleService.daysLabels.length,
      schedule,
    );
  }

  private buildScheduleFromTimeslots(
    hoursCount: number,
    daysCount: number,
    timeslots: TimeSlot[],
  ): TimeSlot[][] {
    const schedule: TimeSlot[][] = [];

    for (let hourIndex = 0; hourIndex < hoursCount; hourIndex++) {
      schedule[hourIndex] = new Array(daysCount);

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const timeslot = timeslots.find((t) => t.index === `${hourIndex}${dayIndex}`);
        const newTimeSlot: TimeSlot = {
          index: `${hourIndex}${dayIndex}`,
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

  onTimeSlotClick(indexes: TimeSlotIndexes) {
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
      if (data && data.lesson && data.location) {
        const tempSchedule = this._class.schedule.slice(); // creates a copy. this_class is immutable
        const index = tempSchedule.findIndex((ts) => ts.index === data.index);
        if (index !== -1) {
          tempSchedule[index] = {
            index: data.index,
            lesson: data.lesson,
            location: data.location,
          };
        } else {
          tempSchedule.push({
            index: `${hourIndex}${dayIndex}`,
            lesson: data.lesson,
            location: data.location,
          });
        }

        const tempClass: Class = {
          _id: this._class._id,
          name: this._class.name,
          level: this._class.level,
          number: this._class.number,
          schedule: tempSchedule,
        };

        // update the class
        this.classService.update(tempClass).then((res) => {
          if (res.data) {
            this._class = res.data.updateClass;
            this.initSchedule();
          }
        });
      } else {
        return;
      }
    });
  }

  onDetailChange(params: ClassDetailsEventParams) {
    const tempClass: Class = {
      _id: this._class._id,
      name: params.name,
      level: params.level,
      number: this._class.number,
      schedule: this._class.schedule,
    };
    this.classService.update(tempClass).then((res) => {
      if (res.data) {
        this._class = res.data.updateClass;
      }
    });
  }
}
