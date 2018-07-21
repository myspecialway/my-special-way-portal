import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { MswErrorStateMatcher } from '../../../../controls/errormatcher';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.html',
  styleUrls: ['./add-user.dialog.scss'],
})

export class AddUserDialogComponent implements OnInit {
  form: FormGroup;
  userTypeKeys: any[];
  userTypes = UserType;
  formControl = new FormControl('', [Validators.required]);
  selectUserType = new FormControl(null, Validators.required);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectGradeConrol = new FormControl('', [Validators.required]);
  matcher = new MswErrorStateMatcher();
  allClasses: Class[];
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: User,
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

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }

  onUserTypeChange(event): void {
    console.log('class value is: ' + event);
    if (event.value === UserType.PRINCIPLE.toString()) {
      this.data.Class = undefined;
      this.allClasses = [];
      this.selectGradeConrol.setValue(''); // [(ngModel)]="data.Class"
      this.selectGradeConrol.disable();
    }
    if (event.value === UserType.TEACHER.toString()) {
      this.classService.getAllClasses().then((data) => {
        this.allClasses = data.data.classes;
      });
    }

  }
}
