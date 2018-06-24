import { DeleteClassDialogComponent } from './delete-class.dialog';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('dashboard component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        DeleteClassDialogComponent,
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(DeleteClassDialogComponent);
    expect(fixture).toMatchSnapshot();
  });
});
