import { Lesson } from './lesson.model';
import { Location } from './location.model';
import { Temporal } from './temporal.model';
export interface TimeSlot {
  index: string;
  hours?: string;
  temporal?: Temporal;
  lesson?: Lesson;
  location?: Location;
  customized?: boolean;
}
