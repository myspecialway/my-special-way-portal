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

  // it('should remove an element from the array', () => {
  //   const array = [1,2,3];
  //   const index = 1;
  //   const fixture = TestBed.createComponent(AddStudentReminderDialogComponent);
  //   fixture.componentInstance.deleteReminder(array, index);
  //   expect(fixture).toEqual(2);
  // });

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
