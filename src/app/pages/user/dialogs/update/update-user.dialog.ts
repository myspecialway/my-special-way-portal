import { BaseUserFormDialogComponent } from './../base/base-user-form-dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})
export class UpdateUserDialogComponent extends BaseUserFormDialogComponent implements OnInit {
  ngOnInit() {
    this.formOptions.submitButtonLabel = 'COMMONS.UPDATE';
  }
}
