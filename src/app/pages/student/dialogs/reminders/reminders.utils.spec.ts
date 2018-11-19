import { ISetReminder } from './../../../../models/reminder.model';
import { getNewReminder, getSetReminder, getDbReminder } from './reminders.utils';
import { IReminder } from '../../../../models/reminder.model';

// @ts-ignore
describe('Reminders Util', () => {
  const dbReminder: IReminder = {
    enabled: true,
    type: 'MEDICINE',
    schedule: [{ daysindex: [3, 4, 5], hours: ['06:00'] }],
  };
  const setReminder: ISetReminder = {
    enabled: true,
    type: 'MEDICINE',
    schedule: [{ daysindex: new Set([3, 4, 5]), hours: new Set(['06:00']) }],
  };
  // @ts-ignore
  it('getNewReminder to work', () => {
    // @ts-ignore
    expect(getNewReminder()).toBeTruthy();
  });

  // @ts-ignore
  it('getSetReminder to work', () => {
    // @ts-ignore
    expect(getSetReminder(dbReminder)).toEqual(setReminder);
  });

  // @ts-ignore
  it('getDbReminder to work', () => {
    // @ts-ignore
    expect(getDbReminder(setReminder)).toEqual(dbReminder);
  });
});
