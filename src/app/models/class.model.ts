export class Class {
  _id: number;
  level: number;
  number: number;
  name: string;
}

export interface ClssQuery  {
  allClasses: Class[];
}
