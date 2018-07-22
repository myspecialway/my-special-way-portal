export class Class {
  _id: string;
  level: string;
  number: number;
  name: string;
}

export interface ClassQuery  {
  allClasses: Class[];
}
