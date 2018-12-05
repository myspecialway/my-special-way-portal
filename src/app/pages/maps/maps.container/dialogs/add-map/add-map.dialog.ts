import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-add-map.dialog',
  templateUrl: './add-map.dialog.html',
  styleUrls: ['./add-map.dialog.scss'],
})
export class AddMapDialogComponent implements OnInit {
  form: FormGroup;
  formControl = new FormControl('', [Validators.required]);
  uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      mapName: '',
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  sendAddMapRequest(dialogData) {
    this.dialogRef.close(dialogData);
    // TODO
  }
}
