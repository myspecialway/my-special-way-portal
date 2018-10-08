import { UserType } from './../../../../models/user.model';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-user.dialog',
  templateUrl: './delete-user.dialog.html',
  styleUrls: ['./delete-user.dialog.scss'],
})
export class DeleteUserDialogComponent {
  userRoleEnum = UserType;

  constructor(public dialogRef: MatDialogRef<DeleteUserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  close(): void {
    this.dialogRef.close();
  }
  submit(): void {}
}
