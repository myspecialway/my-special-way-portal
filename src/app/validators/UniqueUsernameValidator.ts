import { AbstractControl, AsyncValidatorFn, ValidationErrors, AsyncValidator } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { AuthenticationService } from '../services/authentication/authentication.service';

export class UniqueUsernameValidator {
  static createValidator(authenticationService: AuthenticationService, userID: string | number): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return authenticationService
        .checkUsernameUnique(control.value, userID)
        .pipe(map((res) => (res ? null : { isTaken: true })));
    };
  }
}
