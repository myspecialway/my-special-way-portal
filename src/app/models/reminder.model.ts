import { IReminderTime } from './reminder-time.model';

export interface IReminders {
  enabled: boolean;
  data: IReminder[];
}

export interface IReminder {
  type: ReminderType;
  schedule: IReminderTime[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const DEFAULT_REMINDERS: IReminders = {
  enabled: false,
  data: [],
};
