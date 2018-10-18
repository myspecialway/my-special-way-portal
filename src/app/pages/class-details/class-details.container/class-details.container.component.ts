import { first } from 'rxjs/operators';
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
import { UserProfileStateModel } from '../../../apollo/state/resolvers/state.resolver';
import { GET_USER_PROFILE } from '../../../apollo/state/queries/get-user-profile.query';
import { UserType } from '../../../models/user.model';
import { Apollo } from 'apollo-angular';
import { DictionaryService } from '../../../services/language/dictionary.service';

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
    private translate: DictionaryService,
  ) {}
  locales: any = null;
  async ngOnInit() {
    // load localized strings
    this.locales = {
      UPDATESUCCESS: '',
      UPDATEFAILED: '',
      CREATESUCCESS: '',
      CREATEFAILED: '',
    };

    this.locales = await this.translate.generateDictionary(this.locales, { ns: 'CLASS-DETAILS' });

    this.route.params.subscribe(async (params) => {
      try {
        this.idOrNew = params.idOrNew;
        this.isNew = this.idOrNew === '_new_';
        await this.initClass();
        this.initSchedule();
      } catch (err) {
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
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (data: ScheduleDialogData) => {
        if (!data) {
          return;
        }

        const tempClass: Class = {
          _id: this._class._id,
          name: this._class.name,
          grade: this._class.grade,
          schedule: [{ index: data.index, hours: data.hour, lesson: data.lesson, location: data.location }],
        };

        try {
          const updateClass = await this.classService.update(tempClass);
          this._class = updateClass;
          this.initSchedule();
        } catch (error) {}
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
      this.mswSnackbar.displayTimedMessage(this.locales.UPDATESUCCESS);
    } catch (err) {
      this.mswSnackbar.displayTimedMessage(this.locales.UPDATEFAILED);
    }
  }

  private async createClass(classDetails: ClassDetailsEventParams) {
    try {
      const created = await this.classService.create(classDetails);
      this.router.navigate([`/class/${created._id}`]);
      this.mswSnackbar.displayTimedMessage(this.locales.CREATESUCCESS.replace('{{value}}', classDetails.name));

      // this.mswSnackbar.displayTimedMessage(`כיתה ${classDetails.name} נוצרה בהצלחה`);
    } catch (err) {
      this.mswSnackbar.displayTimedMessage(this.locales.CREATEFAILED);
    }
  }
}
