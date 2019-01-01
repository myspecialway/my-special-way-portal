import { MAP_POINT_TYPES, MSW_SYMBOLS } from './../../../maps-constants';
import { IDialogLocation } from './../../../../../models/location.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-edit-point.dialog',
  templateUrl: './add-edit-point.dialog.html',
  styleUrls: ['./add-edit-point.dialog.scss'],
})
export class AddEditPointDialogComponent implements OnInit {
  dialogTitle = 'נקודת ניווט';
  CANCEL = true;
  pointTypes = MAP_POINT_TYPES;
  form: FormGroup;
  formControl = new FormControl('', [Validators.required]);
  isNewPoint = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogLocation,
  ) {
    if (!data._id) {
      this.isNewPoint = true;
    }
  }
  public icons;
  public allicons = MSW_SYMBOLS;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      location_id: '',
      name: '',
      type: '',
      icon: '',
    });
    this.icons = this.allicons;
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  close(cancel = false): void {
    const response = cancel ? undefined : this.form.value;
    this.dialogRef.close(response);
  }
}
