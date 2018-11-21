import { UserType } from './../../../../models/user.model';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-restore-password.dialog',
  templateUrl: './restore.dialog.html',
  styleUrls: ['./restore.dialog.scss'],
})
export class RestorePasswordDialogComponent {
  userRoleEnum = UserType;

  constructor(
    public dialogRef: MatDialogRef<RestorePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  close(): void {
    this.dialogRef.close();
  }
  submit(): void {}
}
