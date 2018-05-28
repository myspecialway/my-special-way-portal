import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../delete/delete.dialog.component.html',
  styleUrls: ['../delete/delete.dialog.component.scss']
})

export class DeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              //TODO: @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    //TODO: this.dataService.deleteIssue(this.data.id);
  }
}
