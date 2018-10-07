import { BaseUserFormDialogComponent } from './../base/base-user-form-dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss'],
})
export class AddUserDialogComponent extends BaseUserFormDialogComponent implements OnInit {
  ngOnInit() {
    this.formOptions.submitButtonLabel = 'הוסף';
    this.classService.getAllClasses().subscribe((classes) => {
      this.classes = [...classes];
    });
  }
}
