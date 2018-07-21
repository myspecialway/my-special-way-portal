export class Class {
  _id: string;
  level: number;
  number: number;
  name: string;
}

export interface ClassQuery  {
  classes: Class[];
}
