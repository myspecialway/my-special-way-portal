import { NonActiveTimeClassData } from './non-active-time-classes-data.model';

export class NonActiveTime {
  _id: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime: string;
  endDateTime: string;
  isAllClassesEvent: boolean;
  classes?: NonActiveTimeClassData[];
}
