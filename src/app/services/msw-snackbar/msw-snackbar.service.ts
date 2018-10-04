import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class MSWSnackbar {
  constructor(private snackbar: MatSnackBar) {}

  public displayTimedMessage(message: string, duration: number = 3000) {
    this.snackbar.open(message, undefined, { duration });
  }
}
