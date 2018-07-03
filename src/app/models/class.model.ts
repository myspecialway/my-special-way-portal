export class Class {
  _id: number;
  level: number;
  number: number;
  name: string;
  schedule?: any;
}

export interface ClassQuery  {
  allClasses: Class[];
  classByName: ($name: string) => Class;
}
