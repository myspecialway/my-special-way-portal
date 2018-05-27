import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import Grade from '../../../models/Grade';

@Injectable()
export class GradeService {
  private readonly API_URL = './mocks/grades.json';

  dataChange: BehaviorSubject<Grade[]> = new BehaviorSubject<Grade[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor (private httpClient: HttpClient) {}

  get data(): Grade[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllGrades(): void {
    this.httpClient.get<Grade[]>(this.API_URL).subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
  addIssue (issue: Grade): void {
    this.dialogData = issue;
  }

  updateIssue (issue: Grade): void {
    this.dialogData = issue;
  }

  deleteIssue (id: number): void {
    console.log(id);
  }
}
