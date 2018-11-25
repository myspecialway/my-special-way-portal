import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BlockedSection } from '../../../../../models/BlockedSection.model';

@Component({
  selector: 'app-add-update-block.dialog',
  templateUrl: './add-update-block.dialog.html',
  styleUrls: ['./add-update-block.dialog.scss'],
})
export class AddUpdateBlockDialogComponent implements OnInit {
  form: FormGroup;
  formControl = new FormControl('', [Validators.required]);
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdateBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BlockedSection,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fromPoint: '',
      toPoint: '',
      blockedReason: '',
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
