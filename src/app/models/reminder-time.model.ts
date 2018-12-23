import { IDialogReminderTime } from './../pages/student/dialogs/reminders/add/add-student-reminder.dialog';
// Describes the reminder times on the student reminder
export interface IReminderTime {
  daysindex: Set<number>;
  hours: Set<string>;
}

export interface IDbReminderTime {
  daysindex: number[];
  hours: string[];
}

export const REMINDERS_CONSTANTS = {
  days: new Set<string>(['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'א-ה']),
  hours: new Set<string>([
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
  ]),
};

export const BASE_REMINDER: IDialogReminderTime = {
  daysindex: new Set<number>([]),
  hours: new Set<string>([]),
  hourSelectorEnabled: true,
};
