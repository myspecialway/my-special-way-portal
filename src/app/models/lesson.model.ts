export interface Lesson {
  _id: string;
  title: string;
  icon: string;
}

export interface LessonQuery {
  lessons: Lesson[];
}
