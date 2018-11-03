import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../../../models/user.model';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export abstract class BaseUserFormDialogComponent {
  subscription: Subscription;
  constructor(
    public dialogRef: MatDialogRef<BaseUserFormDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: User,
  ) {
    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((val) => {
        if (val instanceof NavigationStart) {
          this.close();
        }
      });
  }

  formOptions = { submitButtonLabel: 'COMMONS.ADD' };

  close(): void {
    this.dialogRef.close();
    this.subscription.unsubscribe();
  }

  submitForm(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
