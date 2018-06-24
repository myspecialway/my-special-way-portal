export class Class {
  _id: number;
  level: number;
  number: number;
  name: string;
}

export interface ClassQuery  {
  allClasses: Class[];
}
