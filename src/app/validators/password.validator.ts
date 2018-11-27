import { AbstractControl } from '@angular/forms';

const pattern = /^(?=.*[א-תA-Za-z])(?=.*[0-9])[א-תA-Za-z0-9]{8,}$/g;
const minlength = 8;

export class PasswordValidator {
  static validator(control: AbstractControl) {
    return PasswordValidator.validate(control.value);
  }

  static validate(password: string) {
    if (!password) {
      return null;
    }
    if (password.length < minlength || !password.match(pattern)) {
      return { invalidPassword: 'הסיסמא צריכה להכיל לפחות 8 תווים, כולל אותיות ומספרים' };
    }
    return null;
  }
}
