import { UserType } from '../../../../../models/user.model';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-restore-password-error.dialog',
  templateUrl: './restore-error.dialog.html',
  styleUrls: ['./restore-error.dialog.scss'],
})
export class RestorePasswordErrorDialogComponent {
  userRoleEnum = UserType;

  constructor(
    public dialogRef: MatDialogRef<RestorePasswordErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  close(): void {
    this.dialogRef.close();
  }
  submit(): void {}
}
