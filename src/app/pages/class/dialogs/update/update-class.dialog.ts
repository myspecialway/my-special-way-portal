import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MswErrorStateMatcher } from '../../../../controls/errormatcher';

@Component({
  selector: 'app-update-class.dialog',
  templateUrl: './update-class.dialog.html',
  styleUrls: ['./update-class.dialog.scss'],
})

export class UpdateClassDialogComponent implements OnInit {
  form: FormGroup;
  levels = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
  formControl = new FormControl('', [Validators.required]);
  matcher = new MswErrorStateMatcher();
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<UpdateClassDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      level: '',
      number: '',
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

  updateDetails(): void {
    this.dialogRef.close(this.data);
  }
}
