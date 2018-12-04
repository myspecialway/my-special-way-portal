import { TestBed } from '@angular/core/testing';
import { FileUploadStudentService } from './students-file-upload.service';
import { Papa } from 'ngx-papaparse';
import { ClassService } from '../../pages/class/services/class.graphql.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { classTestData } from '../../../mocks/assets/classes.mock';
import { studentsValidCsvParseResultTestData } from '../../../mocks/assets/students.csv.mock';
import {
  studentsFileErrors,
  studentsInvalidCsvParseResultTestData,
} from '../../../mocks/assets/students.file-upload.errors.mock';
import { of } from 'rxjs';

describe('FileUploadStudentService', () => {
  let authenticationServiceMock: Partial<AuthenticationService>;
  let classServiceMock: Partial<ClassService>;
  let papaMock: Partial<Papa>;
  let service: FileUploadStudentService;

  beforeEach(() => {
    authenticationServiceMock = {
      checkUsernameUnique: jest.fn().mockReturnValue(of(true)),
    };

    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValue(of(classTestData.classes)),
    };

    papaMock = {
      //parse: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FileUploadStudentService,
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: ClassService, useValue: classServiceMock },
        { provide: Papa, useValue: papaMock },
      ],
    });
  });

  it('should be created', () => {
    service = TestBed.get(FileUploadStudentService);
    expect(service).toBeTruthy();
  });

  it('should populate classes field', () => {
    service = TestBed.get(FileUploadStudentService);
    expect(service.classes.length).toBe(classTestData.classes.length);
  });

  it('should return all the students from csv file', async () => {
    papaMock.parse = jest.fn().mockImplementation((file, options) => {
      options.complete(studentsValidCsvParseResultTestData);
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Papa, useValue: papaMock }],
    });
    service = TestBed.get(FileUploadStudentService);

    //when
    const [errors, students] = await service.getStudents({} as File);
    //then
    expect(students.length).toBe(studentsValidCsvParseResultTestData.data.length);
    expect(errors.length).toBe(0);
  });

  it('should return all the format errors', async () => {
    papaMock.parse = jest.fn().mockImplementationOnce((file, options) => {
      options.complete(studentsInvalidCsvParseResultTestData);
    });
    TestBed.configureTestingModule({
      providers: [{ provide: Papa, useValue: papaMock }],
    });
    service = TestBed.get(FileUploadStudentService);

    //when
    const [errors, students] = await service.getStudents({} as File);
    //then
    expect(errors).toEqual(studentsFileErrors);
    expect(students.length).toEqual(6);
  });
});
