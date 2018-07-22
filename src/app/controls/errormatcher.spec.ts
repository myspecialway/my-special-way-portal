import { MswErrorStateMatcher } from './errormatcher';
import { FormControl, Validators } from '@angular/forms';

describe('error matcher', () => {

  beforeEach(() => {

  });

  it('should return false of formcontrol has error but is not dirty, touched or submitted', async () => {
    // given
    const formControl = new FormControl('', [Validators.required]);
    const matcher = new MswErrorStateMatcher();
    // when

    expect(matcher.isErrorState(formControl, null)).toBe(false);
  });

  it('should return true if formcontrol has error and is dirty', async () => {
    // given
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsDirty();
    const matcher = new MswErrorStateMatcher();
    // when

    expect(matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return true if formcontrol has error and is dirty', async () => {
    // given
    const formControl = new FormControl('', [Validators.required]);
    formControl.markAsTouched();
    const matcher = new MswErrorStateMatcher();
    // when

    expect(matcher.isErrorState(formControl, null)).toBe(true);
  });
  it('should return false if formcontrol has no error and is tauched', async () => {
    // given
    const formControl = new FormControl('asd', [Validators.required]);
    formControl.markAsTouched();
    const matcher = new MswErrorStateMatcher();
    // when

    expect(matcher.isErrorState(formControl, null)).toBe(false);
  });

});
