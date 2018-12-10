import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { toHour, hourRegex } from '../utils/hours.utils';

export class HourValidator {
  static hourRangeValidator(formGroup: FormGroup): ValidationErrors | null {
    const startHourControl = formGroup.get('startHour');
    const endHourControl = formGroup.get('endHour');
    const startDateControl = formGroup.get('startDateTime');
    const endDateControl = formGroup.get('endDateTime');
    if (!startHourControl || !endHourControl || !startDateControl || !endDateControl) {
      return null;
    }
    const startDateString = (startDateControl.value as Date).toDateString();
    const endDateString = (endDateControl.value as Date).toDateString();
    if (startDateString !== endDateString) {
      return null;
    }
    const startHour = toHour(startHourControl.value);
    const endHour = toHour(endHourControl.value);
    if (!startHour || !endHour) {
      return null;
    }
    let valid = startHour.hour <= endHour.hour;
    if (startHour.hour === endHour.hour) {
      valid = startHour.minutes < endHour.minutes;
    }
    return valid ? null : { invalidHourRange: true };
  }

  static hourValidator(control: AbstractControl): { [key: string]: any } | null {
    const valid = hourRegex.test(control.value);
    return valid ? null : { invalidHour: true };
  }
}
