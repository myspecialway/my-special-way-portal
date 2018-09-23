import { BaseUserFormDialogComponent } from './../base/base-user-form-dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})
export class UpdateUserDialogComponent extends BaseUserFormDialogComponent implements OnInit {
  ngOnInit() {
    this.formOptions.submitButtonLabel = 'עדכן';
  }
}
