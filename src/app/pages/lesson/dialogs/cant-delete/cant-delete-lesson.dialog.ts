import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cant-delete-lesson.dialog',
  templateUrl: './cant-delete-lesson.dialog.html',
  styleUrls: ['./cant-delete-lesson.dialog.scss'],
})
export class CantDeleteLessonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CantDeleteLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onConfirmClick(): void {
    this.dialogRef.close();
  }
}
