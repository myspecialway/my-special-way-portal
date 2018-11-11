import { IReminderTime, IDbReminderTime } from './reminder-time.model';

export interface IReminder {
  enabled: boolean;
  type: ReminderType;
  schedule: IDbReminderTime[];
}

export interface ISetReminder {
  enabled: boolean;
  type: ReminderType;
  schedule: IReminderTime[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const DEFAULT_REMINDERS: IReminder[] = [
  {
    enabled: false,
    type: ReminderType.MEDICINE,
    schedule: [],
  },
  {
    enabled: false,
    type: ReminderType.REHAB,
    schedule: [],
  },
];
