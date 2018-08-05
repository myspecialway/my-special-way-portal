import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.graphql.service';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss'],
})

export class AddUserDialogComponent implements OnInit {
  form: FormGroup;
  roles: string[];
  userRoleEnum = UserType;
  classes: Class[];
  currentRole: UserType;
  formControl = new FormControl('', [Validators.required]);
  EmailFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectUserType = new FormControl(null, Validators.required);
  selectGrade = new FormControl('', [Validators.required]);
  userNameFormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Za-z]+$')]);
  constructor(private formBuilder: FormBuilder,
              private classService: ClassService,
              public dialogRef: MatDialogRef<AddUserDialogComponent>,
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

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }

  onUserTypeChange(event): void {
      this.currentRole = event;
      if (event === 'MANAGER') {
         this.data.Class = undefined;
      }

  }
  async getClasses() {
    this.classes = await this.classService.getAllClasses();
  }
}
