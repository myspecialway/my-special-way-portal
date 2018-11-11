import { IReminder, ISetReminder } from './../../../../models/reminder.model';
import { BASE_REMINDER, IReminderTime, IDbReminderTime } from './../../../../models/reminder-time.model';
import * as _ from 'lodash';

export const getNewReminder = (): IReminderTime => _.cloneDeep(BASE_REMINDER);

export const getSetReminder = (reminder: IReminder): ISetReminder => {
  const schedule = reminder.schedule.map((slot: IDbReminderTime) => ({
    daysindex: new Set<number>(slot.daysindex),
    hours: new Set<string>(slot.hours),
  }));

  return { ...reminder, schedule };
};

export const getDbReminder = (reminder: ISetReminder): IReminder => {
  const schedule = reminder.schedule.map((slot: IReminderTime) => ({
    daysindex: Array.from(slot.daysindex),
    hours: Array.from(slot.hours),
  }));

  return { ...reminder, schedule };
};
