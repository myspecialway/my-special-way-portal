import { NG_ASYNC_VALIDATORS, AbstractControl, AsyncValidator } from '@angular/forms';
import { Input, Directive } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { UniqueUsernameValidator } from '../validators/UniqueUsernameValidator';

@Directive({
  selector: '[appUniqueUsername]',
  providers: [
    AuthenticationService,
    { provide: NG_ASYNC_VALIDATORS, useExisting: UniqueUsernameValidatorDirective, multi: true },
  ],
})
export class UniqueUsernameValidatorDirective implements AsyncValidator {
  @Input()
  userID: string;

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl) {
    return UniqueUsernameValidator.createValidator(this.authenticationService, this.userID)(control);
  }
}
