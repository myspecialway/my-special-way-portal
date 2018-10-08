import { Class } from './../../../../models/class.model';
import { MatDialogRef } from '@angular/material';
import { User, UserType } from '../../../../models/user.model';
import { BaseUserFormDialogComponent } from './base-user-form-dialog';

describe('BaseUserFormDialogComponent', () => {
  let testClass: BaseUserFormDialogComponent;
  let dialogRef: MatDialogRef<BaseUserFormDialogComponent>;
  let dialogData: User;

  beforeEach(async () => {
    dialogData = {
      email: 'a',
      firstname: 'a',
      lastname: 'a',
      password: 'a',
      role: UserType.PRINCIPLE,
      username: 'a',
      _id: 0,
      class: new Class(),
    };

    dialogRef = {} as MatDialogRef<BaseUserFormDialogComponent>;

    class TestClass extends BaseUserFormDialogComponent {}
    testClass = new TestClass(dialogRef, dialogData);
  });

  it('should trigger dialog close on close call', () => {
    testClass.dialogRef.close = jest.fn();
    testClass.close();

    expect(testClass.dialogRef.close).toBeCalledWith();
  });

  it('should trigger dialog close with data on form submit', () => {
    testClass.dialogRef.close = jest.fn();
    testClass.submitForm(dialogData);

    expect(testClass.dialogRef.close).toBeCalledWith(dialogData);
  });
});
