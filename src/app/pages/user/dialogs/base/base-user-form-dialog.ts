import { Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from '../../../../models/user.model';
import { UserService } from '../../services/user.service';
import { ClassService } from '../../../class/services/class.graphql.service';
import { Class } from '../../../../models/class.model';

export abstract class BaseUserFormDialogComponent {
  constructor(public dialogRef: MatDialogRef<BaseUserFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: User) { }

  @Input()
  protected formOptions = { submitButtonLabel: 'הוסף' };

  close(): void {
    this.dialogRef.close();
  }

  submitForm(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
