import { getNewReminder, getSetReminder, getDbReminder } from './reminders.utils';
import { IReminder } from '../../../../models/reminder.model';

// @ts-ignore
describe('Reminders Util', () => {
  // @ts-ignore
  it('getNewReminder to work', () => {
    // @ts-ignore
    expect(getNewReminder()).toBeTruthy();
  });

  // @ts-ignore
  it('getSetReminder to work', () => {
    const reminder: IReminder = {
      enabled: true,
      type: 'MEDICINE',
      schedule: [{ daysindex: [3, 4, 5], hours: ['06:00'] }],
    };
    console.log('getSetRemindergetSetReminder: ', getSetReminder(reminder));
    // @ts-ignore
    expect(getSetReminder(reminder)).toBeTruthy();
  });

  // @ts-ignore
  it('getDbReminder to work', () => {
    const reminder: IReminder = {
      enabled: true,
      type: 'MEDICINE',
      schedule: [{ daysindex: [3, 4, 5], hours: ['06:00'] }],
    };
    // @ts-ignore
    expect(getDbReminder(reminder)).toBeTruthy();
  });
});
