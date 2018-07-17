import { TimeSlot } from '../../../models/timeslot.model';

export interface ScheduleDialogData extends TimeSlot {
  hour: string;
  day: string;
}
