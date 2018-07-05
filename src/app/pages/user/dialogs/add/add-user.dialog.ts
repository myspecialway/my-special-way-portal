import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.graphql.service';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss'],
})



export class AddUserDialogComponent implements OnInit {
  form: FormGroup;
  keys: any[];
  userTypes = UserType;
  formControl = new FormControl('', [Validators.required]);
  selectUserType = new FormControl(null, Validators.required);
  selectGrade = new FormControl('', [Validators.required]);
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
  ) { this.keys = Object.keys(this.userTypes); }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      userType: '',
      class: undefined,
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }

  onUserTypeChange(event): void {
    console.log('class value is: ' + this.data.Class);
    if (event.value === 'MANAGER') {
      // this.data.Class = undefined;
    }

  }
}

export class InputClearableExample {
  value = 'Clear me';
}