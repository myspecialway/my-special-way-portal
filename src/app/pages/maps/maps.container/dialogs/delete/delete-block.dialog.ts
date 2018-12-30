import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-block.dialog',
  templateUrl: './delete-block.dialog.html',
  styleUrls: ['./delete-block.dialog.scss'],
})
export class DeleteBlockDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteBlockDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
