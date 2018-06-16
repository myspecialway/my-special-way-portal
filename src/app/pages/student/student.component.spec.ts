jest.mock('./services/student.graphql.service');

import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatRowDef, MatHeaderRow, MatDialog } from '@angular/material';
import { StudentComponent } from './student.component';
import { StudentService } from './services/student.graphql.service';

describe('student component', () => {
  beforeEach(async () => {

    class UserDialogMock {
      open = jest.fn().mockImplementation(() => {
        return {
          afterClosed: () => {
            return {
              subscribe: jest.fn(),
            };
          },
        };
      });
    }

    // class UserServiceMock {
    //   getAllUsers = jest.fn().mockImplementation(() => {
    //     return '';
    //   });
    // }

    TestBed.configureTestingModule({
      imports: [

      ],
      declarations: [
        StudentComponent,
        MatHeaderRow,
        MatRowDef,
        MatHeaderRowDef,

      ],
      providers: [
        StudentService,
        { provide: MatDialog, useClass: UserDialogMock },

      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // shallow = new Shallow(UserComponent, AppModule);
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling addNewStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.addNewStudent();
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling deleteStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'sad', 'asd', 'אשוח');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

  it('should open dialog when calling updateeStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.updateStudent(123, 'sad', 'asd', 'asd', 'asd', 'asd', 'asd');
    const studentDialogMock = TestBed.get(MatDialog);
    expect(studentDialogMock.open).toHaveBeenCalled();
  });

});
