import { MswErrorStateMatcher } from './errormatcher';
import { FormControl, Validators } from '@angular/forms';

describe('error matcher', () => {

  beforeEach(() => {
    const matcher = new MswErrorStateMatcher();

  });

  it('should return false of formcontrol has error but is not dirty, touched or submitted', async () => {
    const formControl = new FormControl('', [Validators.required]);
    expect(this.matcher.isErrorState(formControl, null)).toBe(false);
  });

  it('should return true if formcontrol has error and is dirty', async () => {
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsDirty();
    expect(this.matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return true if formcontrol has error and is dirty', async () => {
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsTouched();
    expect(this.matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return false if formcontrol has no error and is tauched', async () => {
    const formControl = new FormControl('asd', [Validators.required]);
    formControl.markAsTouched();
    expect(this.matcher.isErrorState(formControl, null)).toBe(false);
  });

});
