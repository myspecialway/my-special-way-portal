import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-student.dialog',
  templateUrl: './update-student.dialog.html',
  styleUrls: ['./update-student.dialog.scss'],
})
export class UpdateStudentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  updateDetails(): void {
    this.dialogRef.close(this.data);
  }

  // onUserTypeChange(event): void {
  //   console.log('class value is: ' + this.data._class);
  //   if (event.value === 'MANAGER') {
  //     this.data._class = undefined;
  //   }

  // }
}
