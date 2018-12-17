import { MAP_POINT_TYPES } from './../../../maps-constants';
import { Location } from './../../../../../models/location.model';
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
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Location,
  ) {}
  public icons;
  public allicons = ['00026', '00036', '00040', '00047', '00067', '00135', '00319', '00336', '00468', '00524', '00545'];

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

  onIconClick(selectedIcon: string): void {
    this.form.value.icon = selectedIcon;
  }

  onTypeSelect(ev) {}
}
