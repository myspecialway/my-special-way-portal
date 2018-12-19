import { IDialogReminderTime } from './../pages/student/dialogs/reminders/add/add-student-reminder.dialog';
import { IDbReminderTime } from './reminder-time.model';

export interface IReminder {
  enabled: boolean;
  type: ReminderTypeKey;
  schedule: IDbReminderTime[];
}

export interface IDialogReminder {
  enabled: boolean;
  type: ReminderTypeKey;
  schedule: IDialogReminderTime[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export type ReminderTypeKey = keyof typeof ReminderType;

export const getReminderTypeKeys = Object.keys(ReminderType) as ReminderTypeKey[];

export const DEFAULT_REMINDERS: IReminder[] = getReminderTypeKeys.map((key: ReminderTypeKey) => ({
  enabled: false,
  type: key,
  schedule: [],
}));
