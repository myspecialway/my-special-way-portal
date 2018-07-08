import { Lesson } from './lesson.model';
export class Class {
  _id: number;
  level: number;
  number: number;
  name: string;
  schedule?: TimeSlot[];
}

export interface TimeSlot {
  day: string;
  hour: number;
  lesson: Lesson;
}

export interface ClassQuery  {
  allClasses: Class[];
  classByName: ($name: string) => Class;
}
