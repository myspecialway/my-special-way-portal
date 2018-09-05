import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSlot } from '../../../models/timeslot.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { Class } from '../../../models/class.model';
import { ClassDetailsEventParams } from '../class-details.view/class-details.view.component';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="scheduleService.daysLabels"
              [hoursLabels]="scheduleService.hoursLabels"
              [name]="_class && _class.name ? _class.name : null"
              [grade]="_class && _class.grade ? _class.grade : null"
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
    public scheduleService: ScheduleService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private mswSnackbar: MSWSnackbar,
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      try {

        this.idOrNew = params.idOrNew;
        this.isNew = this.idOrNew === '_new_';
        await this.initClass();
        this.initSchedule();
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    });
  }

  private async initClass() {
    try {
      this._class = this.isNew ? new Class() : await this.classService.classById(this.idOrNew);
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
      index: `${hourIndex}_${dayIndex}`,
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
    dialogRef.afterClosed().subscribe(async (data: ScheduleDialogData) => {
      if (!data) {
        return;
      }

      const tempClass: Class = {
        _id: this._class._id,
        name: this._class.name,
        grade: this._class.grade,
        schedule: [
          { index: data.index, lesson: data.lesson, location: data.location },
        ],
      };

      try {
        const updateClass = await this.classService.update(tempClass);
        this._class = updateClass;
        this.initSchedule();
      } catch (error) {

      }
    });
  }

  onDetailChange(classDetails: ClassDetailsEventParams) {
    if (!this.isNew) {
      return this.updateClass(classDetails.name, classDetails.grade);
    }

    // TODO: This check should be in form of validation on fields and not here!
    if (classDetails.name && classDetails.grade) {
      this.createClass(classDetails);
    }
  }

  private async updateClass(name: string, grade: string) {
    try {
      const classToUpdate: Class = {
        ...this._class,
        name,
        grade,
      };

      this._class = await this.classService.update(classToUpdate);
      this.mswSnackbar.displayTimedMessage('הכיתה עודכנה בהצלחה');
    } catch (err) {
      this.mswSnackbar.displayTimedMessage('שגיאה בעדכון כיתה');
    }
  }

  private async createClass(classDetails: ClassDetailsEventParams) {
    try {
      const created = await this.classService.create(classDetails);
      this.router.navigate([`/class/${created._id}`]);
      this.mswSnackbar.displayTimedMessage(`כיתה ${classDetails.name} נוצרה בהצלחה`);
    } catch (err) {
      this.mswSnackbar.displayTimedMessage('שגיאה ביצירת כיתה');
    }
  }
}
