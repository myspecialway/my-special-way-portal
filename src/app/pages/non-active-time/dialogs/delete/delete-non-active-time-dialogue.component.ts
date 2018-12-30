import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-non-active-time-dialogue',
  templateUrl: './delete-non-active-time-dialogue.component.html',
  styleUrls: ['../../../../../assets/scss/msw-alert-dialog.scss'],
})
export class DeleteNonActiveTimeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteNonActiveTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
