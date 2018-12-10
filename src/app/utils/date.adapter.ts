import { NativeDateAdapter } from '@angular/material';

const months = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${month} ${day} ${year}`;
    }

    return date.toDateString();
  }
}
