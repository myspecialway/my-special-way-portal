import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-block.dialog',
  templateUrl: './delete-block.dialog.html',
  styleUrls: ['./delete-block.dialog.scss'],
})
export class DeleteBlockDialogComponent implements OnInit {
  public text: string;
  public isCancelShow = true;
  constructor(public dialogRef: MatDialogRef<DeleteBlockDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.text = `${this.data.question}?`;
    if (this.data.isOnlyAlert) {
      this.isCancelShow = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
