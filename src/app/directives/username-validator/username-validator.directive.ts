import { NG_ASYNC_VALIDATORS, AbstractControl, AsyncValidator } from '@angular/forms';
import { Input, Directive } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UsernameValidator } from '../../validators/username.validator';

@Directive({
  selector: '[appUsername]',
  providers: [
    AuthenticationService,
    { provide: NG_ASYNC_VALIDATORS, useExisting: UsernameValidatorDirective, multi: true },
  ],
})
export class UsernameValidatorDirective implements AsyncValidator {
  @Input()
  userID: string;

  constructor(private authenticationService: AuthenticationService) {}

  validate(control: AbstractControl) {
    return UsernameValidator.createValidator(this.authenticationService, this.userID)(control);
  }
}
