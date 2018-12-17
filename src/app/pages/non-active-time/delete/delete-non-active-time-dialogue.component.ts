import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-non-active-time-dialogue',
  templateUrl: './delete-non-active-time-dialogue.component.html',
  styleUrls: ['./delete-non-active-time-dialogue.component.scss'],
})
export class DeleteNonActiveTimeDialogueComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteNonActiveTimeDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {}
}
