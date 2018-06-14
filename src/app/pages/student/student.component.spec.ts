import { StudentComponent } from './student.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatDialog, MatDialogModule, MatRowDef} from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
import { StudentService } from './services/student.graphql.service';
import { Apollo } from 'apollo-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('dashboard component', () => {
  beforeEach(async () => {

    class StudentDialogMock {
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
    TestBed.configureTestingModule({
      declarations: [
        StudentComponent,
        MatHeaderRowDef,
        MatRowDef,
      ],
      imports: [HttpClientModule, MatDialogModule, BrowserAnimationsModule],
      providers: [StudentService, Apollo,
        { provide: MatDialog, useClass: StudentDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should open dialog when calling deleteStudent function', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    fixture.componentInstance.deleteStudent(123, 'asd', 'asd', '123');
    const StudentDialogMock = TestBed.get(MatDialog);
    expect(StudentDialogMock.open).toHaveBeenCalled();
  });
});
