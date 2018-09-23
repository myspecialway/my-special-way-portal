import { BaseUserFormDialogComponent } from './../base/base-user-form-dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss'],
})
export class AddUserDialogComponent extends BaseUserFormDialogComponent implements OnInit {
  ngOnInit() {
    this.formOptions.submitButtonLabel = 'הוסף';
  }
}
