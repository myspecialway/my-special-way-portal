import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddStudentReminderDialogComponent } from './add-student-reminder.dialog';
import { FormBuilder } from '@angular/forms';

// @ts-ignore
describe('AddStudentReminderDialogComponent', () => {
  // @ts-ignore
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [AddStudentReminderDialogComponent],
      providers: [FormBuilder, MatDialogRef],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  // @ts-ignore
  beforeEach(() => {
    // let component: AddStudentReminderDialogComponent;
    let fixture: ComponentFixture<AddStudentReminderDialogComponent>;
    fixture = TestBed.createComponent(AddStudentReminderDialogComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // @ts-ignore
  it.skip('should close the dialog', () => {
    // console.log('componentcomponent: ', fixture);
    // fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח', 'MALE');
    // const DialogMock = TestBed.get(MatDialog);
    // expect(DialogMock.open).toHaveBeenCalled();
    // @ts-ignore
    // expect(thisFixture.componentInstance.close()).toBeDefined();
  });
});
