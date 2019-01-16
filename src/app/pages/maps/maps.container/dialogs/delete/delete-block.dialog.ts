import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-block.dialog',
  templateUrl: './delete-block.dialog.html',
  styleUrls: ['./delete-block.dialog.scss'],
})
export class DeleteBlockDialogComponent implements OnInit {
  public text: string;

  constructor(public dialogRef: MatDialogRef<DeleteBlockDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (!this.data.isOnlyAlert) {
      this.text = `האם אתה בטוח שברצונך למחוק את ${this.data.question}?`;
    } else {
      this.text = this.data.alertText;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
