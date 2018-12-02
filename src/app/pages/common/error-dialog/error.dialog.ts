import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ErrorDetails {
  title: string;
  details?: string[];
  bottomline: string;
}

@Component({
  selector: 'app-error.dialog',
  templateUrl: './error.dialog.html',
  styleUrls: ['./error.dialog.scss'],
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDetails,
  ) {
    if (!this.data.title) {
      this.data.title = 'שגיאה';
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
