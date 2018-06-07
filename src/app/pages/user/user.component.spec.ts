import { UserComponent } from './user.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatDialogModule, MatRowDef} from '@angular/material';
import {UserService} from './services/user.service';
import {HttpClientModule} from '@angular/common/http';
describe('dashboard component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        UserComponent,
        MatHeaderRowDef,
        MatRowDef,
      ],
      imports: [HttpClientModule, MatDialogModule],
      providers: [UserService],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(UserComponent);
    expect(fixture).toMatchSnapshot();
  });
});
