import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User, UserType} from '../../../../models/user.model';
import {Class} from '../../../../models/class.model';
import {ClassService} from '../../../class/services/class.graphql.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})

export class UpdateUserDialogComponent implements OnInit {
  form: FormGroup;
  roles: string[];
  userRoleEnum = UserType;
  classes: Class[];
  currentRole: string;
  formControl = new FormControl('', [Validators.required]);
  EmailFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectUserType = new FormControl(null, Validators.required);
  selectGrade = new FormControl('', [Validators.required]);
  userNameFormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Za-z]+$')]);

  constructor(private formBuilder: FormBuilder,
              private classService: ClassService,
              public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: User,
              public userService: UserService,
  ) {
    this.roles = Object.keys(this.userRoleEnum);
    this.getClasses();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      userName: this.userNameFormControl,
      email: this.EmailFormControl,
      userType: this.selectUserType,
      class: undefined,
    });

  }

  close(): void {
    this.dialogRef.close();
  }

  updateDetails(): void {
    this.dialogRef.close(this.data);
  }

  async getClasses() {
    this.classes = await this.classService.getAllClasses();
  }
}
