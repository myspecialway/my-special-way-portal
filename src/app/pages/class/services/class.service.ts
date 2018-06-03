import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import Class from '../../../models/Class';

@Injectable()
export class ClassService {
  private readonly API_URL = './mocks/classes.json';

  dataChange: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Class[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllClasses(): void {
    this.httpClient.get<Class[]>(this.API_URL).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addClass (_class: Class): void {
    this.dialogData = _class;
  }

  updateClass (_class: Class): void {
    this.dialogData = _class;
  }

  deleteClass (id: number): void {
    console.log(id);
  }
}
