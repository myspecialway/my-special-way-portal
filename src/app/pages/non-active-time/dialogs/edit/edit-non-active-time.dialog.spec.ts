import {
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDividerModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { TestBed } from '@angular/core/testing';
import { EditNonActiveTimeDialogComponent } from './edit-non-active-time.dialog';
import { NonActiveTime } from '../../../../models/non-active-time.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { classTestData } from '../../../../../mocks/assets/classes.mock';
import { ClassService } from '../../../class/services/class.graphql.service';

describe('EditNonActiveTimeDialogComponent', () => {
  let dialogData: NonActiveTime;
  let classServiceMock: Partial<ClassService>;
  let matDialogRefMock: Partial<MatDialogRef<EditNonActiveTimeDialogComponent>>;

  beforeEach(async () => {
    dialogData = {
      _id: '123',
      title: '',
      isAllDayEvent: true,
      startDateTime: new Date().toUTCString(),
      endDateTime: new Date().toUTCString(),
      isAllClassesEvent: true,
      classes: undefined,
    };

    classServiceMock = {
      getAllClasses: jest.fn().mockImplementation(() => of(classTestData.classes)),
    };

    matDialogRefMock = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [EditNonActiveTimeDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ClassService, useValue: classServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(EditNonActiveTimeDialogComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should output undefined if dialog was canceled', () => {
    const fixture = TestBed.createComponent(EditNonActiveTimeDialogComponent);
    fixture.componentInstance.onNoClick();
    expect(matDialogRefMock.close).toHaveBeenCalledWith();
  });

  it('should output correct NonActiveTime object if dialog was submited', () => {
    const startDateTime = new Date('Tue, 11 Dec 2018 00:00:00 GMT');
    const endDateTime = new Date('Tue, 11 Dec 2018 01:00:00 GMT');
    const fixture = TestBed.createComponent(EditNonActiveTimeDialogComponent);
    fixture.componentInstance.submitForm(
      fixture.componentInstance.formBuilder.group({
        title: ['a'],
        isAllDayEvent: [false],
        startDateTime: [startDateTime],
        endDateTime: [endDateTime],
        startHour: ['09:00'],
        endHour: ['11:00'],
        isAllClassesEvent: [false],
        classes: [[{ _id: '5b10fb1ff8022f6011f30f48', name: 'טיטאן' }]],
      }),
    );
    expect(matDialogRefMock.close).toHaveBeenCalledWith({
      _id: dialogData._id,
      title: 'a',
      isAllDayEvent: false,
      startDateTime: 'Tue, 11 Dec 2018 07:00:00 GMT',
      endDateTime: 'Tue, 11 Dec 2018 09:00:00 GMT',
      isAllClassesEvent: false,
      classes: [{ _id: '5b10fb1ff8022f6011f30f48', name: 'טיטאן' }],
    });
  });
});
