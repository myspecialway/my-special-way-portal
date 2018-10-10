import { Lesson } from './lesson.model';
import { Location } from './location.model';
export interface TimeSlot {
  index: string;
  lesson?: Lesson;
  location?: Location;
  customized?: boolean;
}
