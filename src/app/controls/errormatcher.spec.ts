import { MswErrorStateMatcher } from './errormatcher';
import { FormControl, Validators } from '@angular/forms';

const matcher = new MswErrorStateMatcher();
describe('error matcher', () => {

  it('should return false of formcontrol has error but is not dirty, touched or submitted', async () => {
    const formControl = new FormControl('', [Validators.required]);
    expect(matcher.isErrorState(formControl, null)).toBe(false);
  });

  it('should return true if formcontrol has error and is dirty', async () => {
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsDirty();
    expect(matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return true if formcontrol has error and is dirty', async () => {
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsTouched();
    expect(matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return false if formcontrol has no error and is tauched', async () => {
    const formControl = new FormControl('asd', [Validators.required]);
    formControl.markAsTouched();
    expect(matcher.isErrorState(formControl, null)).toBe(false);
  });

});
