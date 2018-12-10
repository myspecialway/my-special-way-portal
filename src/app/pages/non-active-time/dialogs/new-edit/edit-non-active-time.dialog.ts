import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SubscriptionCleaner } from '../../../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';
import { NonActiveTime } from '../../../../models/non-active-time.model';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';
import { AppDateAdapter } from '../../../../utils/date.adapter';
import { HourValidator } from '../../../../validators/HourValidator';
import { toHour, parseHourStringFromDate } from '../../../../utils/hours.utils';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Component({
  selector: 'app-edit-non-active-time.dialog',
  templateUrl: './edit-non-active-time.dialog.html',
  styleUrls: ['./edit-non-active-time.dialog.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
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
  classes: Class[];

  constructor(
    private formBuilder: FormBuilder,
    private classService: ClassService,
    public dialogRef: MatDialogRef<EditNonActiveTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NonActiveTime,
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: ['', Validators.required],
        isAllDayEvent: [true],
        startDateTime: [new Date()],
        endDateTime: [new Date()],
        startHour: [this.hours[0], { updateOn: 'blur' }],
        endHour: [this.hours[1], { updateOn: 'blur' }],
        isAllClassesEvent: [true],
        classes: [null],
      },
      { validator: HourValidator.hourRangeValidator },
    );

    if (this.data._id) {
      this.setValuesForEdit(this.data);
    }
    this.populateClasses();
    this.isAllDayEvent(this.form.value.isAllDayEvent);
    this.isAllClassesEvent(this.form.value.isAllClassesEvent);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public submitForm() {
    if (this.validateAllFormFields(this.form)) {
      this.prepareFormValuesToOutput();
      this.dialogRef.close(this.form.value);
    }
  }

  private prepareFormValuesToOutput() {
    const startHour = toHour(this.form.getRawValue().startHour) || { hour: 0, min: 0 };
    const endHour = toHour(this.form.getRawValue().endHour) || { hour: 0, min: 0 };
    this.form.value.startDateTime = this.form.value.startDateTime.setHours(startHour.hour, startHour.min, 0, 0);
    this.form.value.endDateTime = this.form.value.endDateTime.setHours(endHour.hour, endHour.min, 0, 0);
  }

  private setValuesForEdit(data: NonActiveTime) {
    const startDateTime = new Date(data.startDateTime);
    const endDateTime = new Date(data.endDateTime);
    this.form.setValue(
      Object.assign(data, {
        startDateTime,
        endDateTime,
        startHour: parseHourStringFromDate(startDateTime),
        endHour: parseHourStringFromDate(endDateTime),
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
