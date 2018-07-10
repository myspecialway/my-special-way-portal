import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})

export class UpdateUserDialogComponent {

  constructor(public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  formControl = new FormControl('', [
    Validators.required,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  close(): void {
    this.dialogRef.close();
  }

  updateDetails(): void {
    this.dialogRef.close(this.data);
  }

  onUserTypeChange(event): void {
     console.log('class value is: ' + this.data._class);
     if (event.value === 'MANAGER') {
       this.data._class = undefined;
     }

   }
}
