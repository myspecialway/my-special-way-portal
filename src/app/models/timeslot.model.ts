import { Lesson } from './lesson.model';

export interface TimeSlot {
  index: string;
  lesson?: Lesson;
}
