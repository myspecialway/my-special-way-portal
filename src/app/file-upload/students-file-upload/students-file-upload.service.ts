import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import Student, { Gender } from '../../models/student.model';
import { ClassService } from '../../pages/class/services/class.graphql.service';
import { Class } from '../../models/class.model';
import { PasswordValidator } from '../../validators/password.validator';
import { UsernameValidator } from '../../validators/username.validator';

export interface StudentError {
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

@Injectable({
  providedIn: 'root',
})
export class FileUploadStudentService {
  classes: Class[] = [];

  constructor(
    private papa: Papa,
    private authenticationService: AuthenticationService,
    private classService: ClassService,
  ) {
    this.populateClasses();
  }

  async getStudents(file: File): Promise<[StudentError[], Student[]]> {
    const result = await this.parseCSV(file);
    return this.csvRowsToStudent(result.data);
  }

  private parseCSV(file): Promise<{ data: string[][] }> {
    return new Promise((resolve) => {
      this.papa.parse(file, {
        skipEmptyLines: true,
        complete: resolve,
      });
    });
  }

  private async csvRowsToStudent(csvRowsArray: string[][]): Promise<[StudentError[], Student[]]> {
    const studentsFromFile: Student[] = [];
    const studentsFileErrors: StudentError[] = [];
    for (let i = 0; i < csvRowsArray.length; i++) {
      const row = csvRowsArray[i];
      const student = new Student();
      const errors: StudentError = { index: i, fields: [] };
      this.setFirstname(row, errors, student);
      this.setLastname(row, errors, student);
      this.setGender(row, errors, student);
      this.setClass(row, errors, student);
      await this.setUsername(row, errors, student, studentsFromFile);
      this.setPassword(row, errors, student);
      //save the user in memory even if was errors.
      //needed for detecting username uniqness in file.
      studentsFromFile.push(student);
      if (errors.fields.length !== 0) {
        studentsFileErrors.push(errors);
      }
    }
    return [studentsFileErrors, studentsFromFile];
  }

  private setPassword(row: string[], errors: StudentError, student: Student) {
    const password = row[passwordCsvColumn.index];
    if (!password || PasswordValidator.validate(password)) {
      errors.fields.push(passwordCsvColumn.display);
    } else {
      student.password = password;
    }
  }

  private async setUsername(row: string[], errors: StudentError, student: Student, studentsFromFile: Student[]) {
    const username = row[usernameCsvColumn.index];
    const invalidUsername = await UsernameValidator.validate(this.authenticationService, username, '').toPromise();
    const usernameAlreadyWasInFile = studentsFromFile.find((studentRecord) => studentRecord.username === username);
    if (!username || invalidUsername || usernameAlreadyWasInFile) {
      errors.fields.push(usernameCsvColumn.display);
    } else {
      student.username = username;
    }
  }

  private setClass(row: string[], errors: StudentError, student: Student) {
    const classname = row[classCsvColumn.index];
    const classesMatch = this.classes.filter((classObj) => classObj.name === classname);
    if (!classname || !classesMatch[0]) {
      errors.fields.push(classCsvColumn.display);
    } else {
      student.class = classesMatch[0];
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

  private async populateClasses() {
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
