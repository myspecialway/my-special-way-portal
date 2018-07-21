import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';
import { UserType } from '../../../../models/user.model';
import { MswErrorStateMatcher } from '../../../../controls/errormatcher';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})

export class UpdateUserDialogComponent  implements OnInit {
  form: FormGroup;
  userTypeKeys: any[];
  userTypes = UserType;
  formControl = new FormControl('', [Validators.required]);
  selectUserType = new FormControl(null, Validators.required);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectGradeConrol = new FormControl('', [Validators.required]);
  matcher = new MswErrorStateMatcher();
  allClasses: Class[];
  constructor(public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private classService: ClassService,
              ) {
                  this.userTypeKeys = Object.keys(this.userTypes);
                }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      userType: '',
      class: undefined,
    });
    this.classService.getAllClasses().then((data) => {
      this.allClasses = data.data.classes;
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

  // confirmAdd(dialogData): void {
  //   this.dialogRef.close(dialogData);
  // }
  updateDetails(): void {
    this.dialogRef.close(this.data);
  }

  onUserTypeChange(event): void {
    //  console.log('class value is: ' + this.data._class);
    //  if (event.value === 'MANAGER') {
    //    this.data._class = undefined;
    //  }

   }
}
