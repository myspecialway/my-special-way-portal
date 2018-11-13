import { IReminderTime, IDbReminderTime } from './reminder-time.model';

export interface IReminder {
  enabled: boolean;
  type: ReminderTypeKey;
  schedule: IDbReminderTime[];
}

export interface ISetReminder {
  enabled: boolean;
  type: ReminderTypeKey;
  schedule: IReminderTime[];
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
