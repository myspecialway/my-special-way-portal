import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import { StudentService } from './services/student.service';
import Student, { Gender } from '../../models/student.model';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Apollo } from 'apollo-angular';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserType } from '../../models/user.model';
import { Papa } from 'ngx-papaparse';
import { Class } from '../../models/class.model';
import { ClassService } from '../class/services/class.graphql.service';
import { PasswordValidator } from '../../validators/password.validator';
import { UsernameValidator } from '../../validators/username.validator';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { ErrorDialogComponent, ErrorDetails } from '../../components/error-dialog/error.dialog';

interface StudentError {
  index: number;
  fields: string[];
}

interface CsvColumn {
  index: number;
  display: string;
}

const firstnameCsvColumn: CsvColumn = { index: 0, display: 'שם פרטי' };
const lastnameCsvColumn: CsvColumn = { index: 1, display: 'שם משפחה' };
const genderCsvColumn: CsvColumn = { index: 2, display: 'מין' };
const classCsvColumn: CsvColumn = { index: 3, display: 'כיתה' };
const usernameCsvColumn: CsvColumn = { index: 4, display: 'שם משתמש' };
const passwordCsvColumn: CsvColumn = { index: 5, display: 'סיסמא' };

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  displayedColumns = ['studentName', 'gradeId', 'username', 'deleteUser'];
  dataSource = new MatTableDataSource<Student>();
  classes: Class[];
  studentsFileErrors: StudentError[];
  studentsFromFile: Student[];
  fileInput: string;
  mayAddStudent = false;
  mayDeleteStudent = false;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private studentService: StudentService,
    private authenticationService: AuthenticationService,
    private snackbar: MSWSnackbar,
    private classService: ClassService,
    private dialog: MatDialog,
    private apollo: Apollo,
    private papa: Papa,
  ) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.subCollector.add(
      this.studentService.getAllStudents().subscribe((data) => {
        this.dataSource.data = [...data];
      }),
    );

    this.dataSource.sortingDataAccessor = (item) => item.firstname + item.lastname;

    // todo: create a currentUser / permissions service / directive to handle permissions.
    this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        const currentType = userProf.data.userProfile.role;
        this.mayAddStudent = UserType[currentType] === UserType.PRINCIPLE;
        this.mayDeleteStudent = UserType[currentType] === UserType.PRINCIPLE;
      });
    this.populateClasses();
  }

  async deleteStudent(id: number, firstName: string, lastName: string, gradeId: string, gender: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: { id, firstName, lastName, gradeId, gender },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (deletionConfirmed) => {
        if (!deletionConfirmed) {
          return;
        }

        try {
          await this.studentService.delete(id);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }

  onFileChange(event) {
    const files = event.target.files || event.srcElement.files;
    this.fileInput = '';
    if (files && files.length !== 0) {
      this.papa.parse(files[0], {
        skipEmptyLines: true,
        complete: async (result) => {
          await this.csvRowsToStudent(result.data);
          if (this.studentsFileErrors.length === 0) {
            try {
              await this.studentService.createMany(this.studentsFromFile);
              this.snackbar.displayTimedMessage('קובץ נטען בהצלחה');
            } catch (error) {
              const errorDetails: ErrorDetails = {
                title: 'שגיאה בטעינת הקובץ',
                details: [error.message],
                bottomline: 'אנא נסה שנית.',
              };
              this.dialog.open(ErrorDialogComponent, {
                data: errorDetails,
              });
            }
          } else {
            const errorDetails = this.buildErrorMessage();
            this.dialog.open(ErrorDialogComponent, {
              data: errorDetails,
            });
          }
        },
      });
    }
  }

  private async csvRowsToStudent(csvRowsArray: string[][]) {
    this.studentsFromFile = [];
    this.studentsFileErrors = [];
    for (let i = 0; i < csvRowsArray.length; i++) {
      const row = csvRowsArray[i];
      const student = new Student();
      const errors: StudentError = { index: i, fields: [] };
      this.setFirstname(row, errors, student);
      this.setLastname(row, errors, student);
      this.setGender(row, errors, student);
      this.setClass(row, errors, student);
      await this.setUsername(row, errors, student);
      this.setPassword(row, errors, student);
      //save the user in memory even if was errors.
      //needed for detecting username uniqness in file.
      this.studentsFromFile.push(student);
      if (errors.fields.length !== 0) {
        this.studentsFileErrors.push(errors);
      }
    }
  }

  private setPassword(row: string[], errors: StudentError, student: Student) {
    const password = row[passwordCsvColumn.index];
    if (!password || PasswordValidator.validate(password)) {
      errors.fields.push(passwordCsvColumn.display);
    } else {
      student.password = password;
    }
  }

  private async setUsername(row: string[], errors: StudentError, student: Student) {
    const username = row[usernameCsvColumn.index];
    const invalidUsername = await UsernameValidator.validate(this.authenticationService, username, '').toPromise();
    const usernameAlreadyWasInFile = this.studentsFromFile.find((studentRecord) => studentRecord.username === username);
    if (!username || invalidUsername || usernameAlreadyWasInFile) {
      errors.fields.push(usernameCsvColumn.display);
    } else {
      student.username = username;
    }
  }

  private setClass(row: string[], errors: StudentError, student: Student) {
    const classname = row[classCsvColumn.index];
    const classes = this.classes.filter((classObj) => classObj.name === classname);
    if (!classname || classes.length === 0) {
      errors.fields.push(classCsvColumn.display);
    } else {
      student.class = classes[0];
    }
  }

  private setGender(row: string[], errors: StudentError, student: Student) {
    const genderHebrew = row[genderCsvColumn.index];
    const gender = genderHebrew === 'בת' ? Gender.FEMALE : Gender.MALE;
    if (!genderHebrew || ['בת', 'בן'].indexOf(genderHebrew) < 0) {
      errors.fields.push(genderCsvColumn.display);
    } else {
      student.gender = gender;
    }
  }

  private setLastname(row: string[], errors: StudentError, student: Student) {
    const lastname = row[lastnameCsvColumn.index];
    if (!lastname) {
      errors.fields.push(lastnameCsvColumn.display);
    } else {
      student.lastname = lastname;
    }
  }

  private setFirstname(row: string[], errors: StudentError, student: Student) {
    const firstname = row[firstnameCsvColumn.index];
    if (!firstname) {
      errors.fields.push(firstnameCsvColumn.display);
    } else {
      student.firstname = firstname;
    }
  }

  private buildErrorMessage(): ErrorDetails {
    const details: string[] = [];
    for (const rowError of this.studentsFileErrors) {
      let detailsStr = `שורה ${rowError.index + 1} - `;
      for (const field of rowError.fields) {
        detailsStr += `${field}, `;
      }
      detailsStr = detailsStr.slice(0, -2);
      details.push(detailsStr);
    }
    return { title: 'קובץ לא תקין', details, bottomline: 'אנא תקן את הקובץ ונסה שנית.' };
  }

  private populateClasses() {
    try {
      this.classService.getAllClasses().subscribe((classes) => {
        this.classes = [...classes];
      });
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }
}
