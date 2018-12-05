import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-exit-system.dialog',
  templateUrl: './exit-system.dialog.html',
  styleUrls: ['./exit-system.dialog.scss'],
})
export class ExitSystemDialogComponent {
  constructor(public dialogRef: MatDialogRef<ExitSystemDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  close(): void {
    this.dialogRef.close();
  }
  confirmExit(): void {}
}
