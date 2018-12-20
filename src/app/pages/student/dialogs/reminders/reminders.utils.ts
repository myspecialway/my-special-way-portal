import { IDialogReminderTime } from './add/add-student-reminder.dialog';
import { IReminder, IDialogReminder } from './../../../../models/reminder.model';
import { BASE_REMINDER, IReminderTime, IDbReminderTime } from './../../../../models/reminder-time.model';
import * as _ from 'lodash';

export const getNewReminder = (): IDialogReminderTime => _.cloneDeep(BASE_REMINDER);

export const getSetReminder = (reminder: IReminder): IDialogReminder => {
  const schedule = reminder.schedule.map((slot: IDbReminderTime) => ({
    daysindex: new Set<number>(slot.daysindex),
    hours: new Set<string>(slot.hours),
    hourSelectorEnabled: true,
  }));

  return { ...reminder, schedule };
};

export const getDbReminder = (reminder: IDialogReminder): IReminder => {
  const schedule = reminder.schedule.map((slot: IReminderTime) => ({
    daysindex: Array.from(slot.daysindex),
    hours: Array.from(slot.hours),
  }));

  return { ...reminder, schedule };
};
