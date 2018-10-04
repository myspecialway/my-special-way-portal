import { Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../../../models/user.model';

export abstract class BaseUserFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BaseUserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: User,
  ) {}

  @Input()
  formOptions = { submitButtonLabel: 'הוסף' };

  close(): void {
    this.dialogRef.close();
  }

  submitForm(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
