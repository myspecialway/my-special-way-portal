import { AppDateAdapter } from './date.adapter';
import { Platform } from '@angular/cdk/platform';

describe('AppDateAdapter', () => {
  let appDateAdapter: AppDateAdapter;
  let date: Date;

  beforeEach(() => {
    appDateAdapter = new AppDateAdapter('en-US', new Platform());
    date = new Date('Tue, 11 Dec 2018 09:00:00 GMT');
  });

  it('should format date', () => {
    const result = appDateAdapter.format(date, 'input');
    expect(result).toBe('דצמבר 11 2018');
  });

  it('should not format for non "input" displayFormat', () => {
    const result = appDateAdapter.format(date, 'dummy');
    expect(result).toBe(date.toDateString());
  });
});
