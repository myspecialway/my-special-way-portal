import { HourValidator } from './HourValidator';
import { AbstractControl, FormGroup } from '@angular/forms';

describe('HourValidator', () => {
  describe('hour validator', () => {
    it('should return null for valid hour', () => {
      const controlMock = { value: '09:52' } as AbstractControl;
      expect(HourValidator.hourValidator(controlMock)).toBeNull();
    });

    it('should return object for invalid hour', () => {
      const controlMock = { value: '99:99' } as AbstractControl;
      expect(HourValidator.hourValidator(controlMock)).toEqual({ invalidHour: true });
    });
  });
  describe('hour range validator', () => {
    it('should return null for valid hour range', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation((field) => {
          switch (field) {
            case 'startHour':
              return { value: '08:00' };
            case 'endHour':
              return { value: '09:00' };
            case 'startDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
            case 'endDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
          }
        }),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toBeNull();
    });

    it('should return object for invalid hour range (end hour before start)', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation((field) => {
          switch (field) {
            case 'startHour':
              return { value: '09:00' };
            case 'endHour':
              return { value: '08:00' };
            case 'startDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
            case 'endDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
          }
        }),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toEqual({ invalidHourRange: true });
    });

    it('should return object for invalid hour range (end minutes before start)', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation((field) => {
          switch (field) {
            case 'startHour':
              return { value: '09:10' };
            case 'endHour':
              return { value: '09:00' };
            case 'startDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
            case 'endDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
          }
        }),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toEqual({ invalidHourRange: true });
    });

    it('should return null if the start date and and date are not the same day', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation((field) => {
          switch (field) {
            case 'startHour':
              return { value: '09:00' };
            case 'endHour':
              return { value: '08:00' };
            case 'startDateTime':
              return { value: new Date('Tue, 11 Dec 2018 00:00:00 GMT') };
            case 'endDateTime':
              return { value: new Date('Tue, 12 Dec 2018 00:00:00 GMT') };
          }
        }),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toBeNull();
    });

    it('should return null if form control is null', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation(() => null),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toBeNull();
    });
    it('should return null if the hour is illegal', () => {
      const formGroupMock: Partial<FormGroup> = {
        get: jest.fn().mockImplementation((field) => {
          switch (field) {
            case 'startHour':
              return { value: '99:99' };
            case 'endHour':
              return { value: '99:99' };
            case 'startDateTime':
              return { value: new Date('Tue, 11 Dec 2018 99:99:00 GMT') };
            case 'endDateTime':
              return { value: new Date('Tue, 12 Dec 2018 99:99:00 GMT') };
          }
        }),
      };
      expect(HourValidator.hourRangeValidator(formGroupMock as FormGroup)).toBeNull();
    });
  });
});
