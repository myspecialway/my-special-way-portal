import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators/map';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { of } from 'rxjs';

const pattern = /^[א-תA-Za-z0-9]+$/g;
const minlength = 5;

export class UsernameValidator {
  static createValidator(authenticationService: AuthenticationService, userID: string | number): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return UsernameValidator.validate(authenticationService, control.value, userID);
    };
  }

  static validate(authenticationService: AuthenticationService, username: string, userID: string | number) {
    // validate minlength
    if (username.length < minlength) {
      return of({ invalidUsername: 'שם משתמש חייב להיות לפחות חמישה תווים' });
    }
    // validate pattern
    if (!username.match(pattern)) {
      return of({ invalidUsername: 'שם משתמש יכול להכיל אותיות וספרות בלבד' });
    }
    // validate uniqness
    return authenticationService
      .checkUsernameUnique(username, userID)
      .pipe(map((res) => (res ? null : { invalidUsername: 'שם משתמש כבר קיים. אנא נסה שם משתמש אחר' })));
  }
}
