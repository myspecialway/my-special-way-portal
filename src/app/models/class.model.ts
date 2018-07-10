import { Lesson } from './lesson.model';
export class Class {
  _id: number;
  level: number;
  number: number;
  name: string;
  schedule?: TimeSlot[];
}

export interface TimeSlot {
  index: string;
  lesson: Lesson;
}

export interface ClassQuery  {
  allClasses: Class[];
  classByName: ($name: string) => Class;
}
