import { NG_ASYNC_VALIDATORS, AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Input, Directive } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { map } from 'rxjs/operators/map';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Directive({
  selector: '[appUniqueUsername]',
  providers: [
    AuthenticationService,
    { provide: NG_ASYNC_VALIDATORS, useExisting: UniqueUsernameValidatorDirective, multi: true },
  ],
})
export class UniqueUsernameValidatorDirective implements AsyncValidator {
  @Input()
  userId: string;

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.authenticationService
      .checkUsernameUnique(control.value, this.userId)
      .pipe(map((res) => (res ? null : { isTaken: true })));
  }
}
