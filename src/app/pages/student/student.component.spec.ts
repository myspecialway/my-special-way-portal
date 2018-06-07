import { StudentComponent } from './student.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatDialogModule, MatRowDef} from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
describe('dashboard component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        StudentComponent,
        MatHeaderRowDef,
        MatRowDef,
      ],
      imports: [HttpClientModule, MatDialogModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(StudentComponent);
    expect(fixture).toMatchSnapshot();
  });
});
