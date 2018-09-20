import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-update-user.dialog',
  templateUrl: './update-user.dialog.html',
  styleUrls: ['./update-user.dialog.scss'],
})
export class UpdateUserDialogComponent {
  form: FormGroup;
  roles: string[];
  userRoleEnum = UserType;
  classes: Class[];
  currentRole: string;

  formControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    private classService: ClassService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.roles = Object.keys(this.userRoleEnum);
    this.getClasses();
    this.currentRole = data.role;
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  updateDetails(): void {
    this.dialogRef.close(this.data);
  }

  onUserTypeChange(event): void {
    this.currentRole = event;

    if (event === 'MANAGER') {
      this.data._class = undefined;
    }
  }

  async getClasses() {
    this.classes = await this.classService.getAllClasses();
  }
}
