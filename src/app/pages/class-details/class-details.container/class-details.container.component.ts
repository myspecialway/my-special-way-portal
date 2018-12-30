import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSlot } from '../../../models/timeslot.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { TimeSlotIndexes } from '../../../components/schedule/schedule.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ScheduleDialogComponent } from '../../../components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleDialogData } from '../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { Class } from '../../../models/class.model';
import { ClassDetailsEventParams } from '../class-details.view/class-details.view.component';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { UserProfileStateModel } from '../../../apollo/state/resolvers/state.resolver';
import { GET_USER_PROFILE } from '../../../apollo/state/queries/get-user-profile.query';
import { UserType } from '../../../models/user.model';
import { Apollo } from 'apollo-angular';
import { DeleteTimeSlotDialogComponent } from '../../../components/schedule/delete-schedule-dialog/delete-time-slot.dialog';

@Component({
  selector: 'app-class-details-container',
  template: `<app-class-details-view
              [schedule]="schedule"
              [daysLabels]="scheduleService.daysLabels"
              [hoursLabels]="scheduleService.hoursLabels"
              [name]="_class && _class.name ? _class.name : null"
              [grade]="_class && _class.grade ? _class.grade : null"
              [shouldShowClassInfo]="shouldShowClassInfo"
              (timeslotClicked)="onTimeSlotClick($event)"
              (timeSlotDeleted)="onTimeSlotDelete($event)"
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
  shouldShowClassInfo: boolean;

  constructor(
    public scheduleService: ScheduleService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private mswSnackbar: MSWSnackbar,
    private apollo: Apollo,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      try {
        this.idOrNew = params.idOrNew;
        this.isNew = this.idOrNew === '_new_';
        await this.initClass();
        await this.initSchedule();
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    });
    // todo: create a currentUser / permissions service / directive to handle permissions.
    this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        const currentType = userProf.data.userProfile.role;
        this.shouldShowClassInfo = UserType[currentType] === UserType.PRINCIPLE;
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

    const dialogData = this.getDialogData(indexes);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: dialogData,
      height: '500px',
      width: '460px',
    });

    this.onDialogRefClose(dialogRef, async (data) => {
      const tempClass: Class = {
        _id: this._class._id,
        name: this._class.name,
        grade: this._class.grade,
        schedule: [{ index: data.index, hours: data.hour, lesson: data.lesson, location: data.location , temporal: { expired: new Date(), lesson: data.lesson, location: data.location }}],
      };

      return await this.classService.update(tempClass);
    });
  }

  private onDialogRefClose<T, R = any>(dialogRef: MatDialogRef<T, R>, next: (data) => Promise<Class>) {
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (data) => {
        if (!data) {
          return;
        }

        try {
          this._class = await next(data);
          this.initSchedule();
        } catch (error) {}
      });
  }

  onTimeSlotDelete(indexes: TimeSlotIndexes) {
    if (!this._class._id) {
      return;
    }

    const dialogData = this.getDialogData(indexes);

    const dialogRef = this.dialog.open(DeleteTimeSlotDialogComponent, {
      data: dialogData,
    });

    this.onDialogRefClose(dialogRef, async (data) => {
      return await this.classService.deleteScheduleSlotFromClass(
        this._class._id,
        `${indexes.hourIndex}_${indexes.dayIndex}`,
      );
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
      this.mswSnackbar.displayTimedMessage('שגיאה ביצירת כיתה: ' + err.message);
    }
  }

  getDialogData(indexes: TimeSlotIndexes) {
    const { hourIndex, dayIndex } = indexes;

    return {
      index: `${hourIndex}_${dayIndex}`,
      lesson: this.schedule[hourIndex][dayIndex].lesson,
      location: this.schedule[hourIndex][dayIndex].location,
      hour: this.scheduleService.hoursLabels[hourIndex],
      day: this.scheduleService.daysLabels[dayIndex],
    } as ScheduleDialogData;
  }
}
