import { Class } from './class.model';

export class NonActiveTime {
  _id: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime: number;
  endDateTime: number;
  isAllClassesEvent: boolean;
  classes?: Class[];
}
