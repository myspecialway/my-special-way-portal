import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-student.dialog',
  templateUrl: './delete-student.dialog.html',
  styleUrls: ['./delete-student.dialog.scss'],
})
export class DeleteStudentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
