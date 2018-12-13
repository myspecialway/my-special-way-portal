import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { PasswordValidator } from '../../validators/password.validator';

@Directive({
  selector: '[appPassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }],
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl) {
    return PasswordValidator.validator(control);
  }
}
