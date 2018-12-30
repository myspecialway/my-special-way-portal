import { Lesson } from './lesson.model';
import { Location } from './location.model';
export interface TimeSlot {
  index: string;
  hours?: string;
  lesson?: Lesson;
  location?: Location;
  temporal?: Temporal;
  customized?: boolean;
}
export interface Temporal {
  expired: Date;
  lesson?: Lesson;
  location?: Location;
  customized?: boolean;
}