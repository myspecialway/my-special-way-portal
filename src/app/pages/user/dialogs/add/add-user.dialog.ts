import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassService } from '../../../class/services/class.service';
import User, { UserType } from '../../../../models/User';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss']
})

export class AddUserDialogComponent implements OnInit {
  form: FormGroup;
  UserType = UserType;
  formControl = new FormControl('', [
    Validators.required
  ]);

  selectUserType = new FormControl(null, Validators.required);
  selectGrade = new FormControl('', [Validators.required]);
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public userService: UserService,
    public classService: ClassService) { }

  ngOnInit(): void {
    this.classService.getAllClasses();
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      userType: '',
      _class: undefined
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
    console.log('class value is: ' + this.data._class);
    if (event.value === 'MANAGER') {
      this.data._class = undefined;
    }

  }
}
