import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-lesson.dialog',
  templateUrl: './delete-lesson.dialog.html',
  styleUrls: ['../../../../../assets/scss/msw-alert-dialog.scss'],
})
export class DeleteLessonDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteLessonDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
