import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-add-class.dialog',
  templateUrl: './add-class.dialog.html',
  styleUrls: ['./add-class.dialog.scss'],
})

export class AddClassDialogComponent implements OnInit {
  form: FormGroup;
  keys: any[];
  formControl = new FormControl('', [Validators.required]);
  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddClassDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Class,
  ) { }

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

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
