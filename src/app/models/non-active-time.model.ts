import { Class } from './class.model';

export class NonActiveTime {
  _id: string;
  title: string;
  isAllDayEvent: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
  isAllClassesEvent: boolean;
  classes?: Class[];
}
