import { BASE_REMINDER, IReminderTime, IDbReminderTime } from './../../../../models/reminder-time.model';
import * as _ from 'lodash';

export const getNewReminder = (): IReminderTime => _.cloneDeep(BASE_REMINDER);

export const getRemindersSchedule = (reminderSlots: IDbReminderTime[]): IReminderTime[] =>
  reminderSlots.map((slot: IDbReminderTime) => {
    return {
      daysindex: new Set<number>(slot.daysindex),
      hours: new Set<string>(slot.hours),
    };
  });
