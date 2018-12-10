import { Lesson } from './lesson.model';
import { Location } from './location.model';

// Describes a single timeslot on the schedule
export interface Temporal {
  expired: Date;
  lesson?: Lesson;
  location?: Location;
}
