import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubscriptionCleaner } from '../../../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';
import { NonActiveTime } from '../../../../models/non-active-time.model';
import { ClassService } from '../../../class/services/class.graphql.service';
import { HourValidator } from '../../../../validators/hour-validator/HourValidator';
import { toHour } from '../../../../utils/hours.utils';
import { NonActiveTimeClassData } from '../../../../models/non-active-time-classes-data.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Moment } from 'moment';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MMMM DD YYYY',
  },
  display: {
    dateInput: 'MMMM DD YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-edit-non-active-time.dialog',
  templateUrl: './edit-non-active-time.dialog.html',
  styleUrls: ['./edit-non-active-time.dialog.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
})
export class EditNonActiveTimeDialogComponent implements OnInit {
  @SubscriptionCleaner()
  subCollector: Subscription;

  updateButtonTitle = 'עדכן';
  addButtonTitle = 'הוסף';
  updateDialogTitle = 'עדכון זמן אי פעילות';
  addDialogTitle = 'הוספת זמן אי פעילות';
  hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  form: FormGroup;
  classes: NonActiveTimeClassData[];

  constructor(
    public formBuilder: FormBuilder,
    public classService: ClassService,
    public dialogRef: MatDialogRef<EditNonActiveTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NonActiveTime,
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: ['', Validators.required],
        isAllDayEvent: [true],
        startDateTime: [moment()],
        endDateTime: [moment()],
        startHour: [this.hours[0], { updateOn: 'blur' }],
        endHour: [this.hours[1], { updateOn: 'blur' }],
        isAllClassesEvent: [true],
        classes: [null],
      },
      { validator: HourValidator.hourRangeValidator },
    );

    if (this.data._id && this.data._id !== '') {
      this.setValuesForEdit(this.data);
    }
    this.populateClasses();
    this.isAllDayEvent(this.form.value.isAllDayEvent);
    this.isAllClassesEvent(this.form.value.isAllClassesEvent);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public submitForm(form: FormGroup) {
    if (this.validateAllFormFields(form)) {
      this.dialogRef.close(this.prepareOutput(form));
    }
  }

  private prepareOutput(form: FormGroup): NonActiveTime {
    const startHour = toHour(form.getRawValue().startHour) || { hour: 0, min: 0 };
    const endHour = toHour(form.getRawValue().endHour) || { hour: 0, min: 0 };
    (form.value.startDateTime as Moment).hours(startHour.hour).minutes(startHour.min);
    (form.value.endDateTime as Moment).hours(endHour.hour).minutes(endHour.min);

    return {
      _id: this.data._id,
      title: form.value.title,
      isAllDayEvent: form.value.isAllDayEvent,
      startDateTime: (form.value.startDateTime as Moment).toDate().toUTCString(),
      endDateTime: (form.value.endDateTime as Moment).toDate().toUTCString(),
      isAllClassesEvent: form.value.isAllClassesEvent,
      classes: form.value.classes,
    };
  }

  private setValuesForEdit(data: NonActiveTime) {
    const startDateTime = moment(data.startDateTime);
    const endDateTime = moment(data.endDateTime);
    this.form.setValue(
      Object.assign(data, {
        startDateTime,
        endDateTime,
        startHour: startDateTime.format('hh:mm'),
        endHour: endDateTime.format('hh:mm'),
      }),
    );
  }

  private populateClasses() {
    try {
      this.classService.getAllClasses().subscribe((classes) => {
        this.classes = [...classes];
      });
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  private isAllDayEvent(flag: boolean) {
    if (flag) {
      this.form.controls.startHour.disable();
      this.form.controls.startHour.clearValidators();
      this.form.controls.endHour.disable();
      this.form.controls.endHour.clearValidators();
    } else {
      this.form.controls.startHour.enable();
      this.form.controls.startHour.setValidators([HourValidator.hourValidator, Validators.required]);
      this.form.controls.endHour.enable();
      this.form.controls.endHour.setValidators([HourValidator.hourValidator, Validators.required]);
    }
  }

  private isAllClassesEvent(flag: boolean) {
    if (flag) {
      this.form.controls.classes.disable();
      this.form.controls.classes.clearValidators();
    } else {
      this.form.controls.classes.enable();
      this.form.controls.classes.setValidators([Validators.required]);
    }
  }

  private validateAllFormFields(formGroup: FormGroup): boolean {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl && control.validator) {
        control.setErrors(control.validator(control));
        if (control.errors) {
          formGroup.setErrors({ invalid: true });
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    return formGroup.errors === null;
  }
}
