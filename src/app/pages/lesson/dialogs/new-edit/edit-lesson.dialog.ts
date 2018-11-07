import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-lesson.dialog',
  templateUrl: './edit-lesson.dialog.html',
  styleUrls: ['./edit-lesson.dialog.scss'],
})
export class EditLessonDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  private onNoClick(): void {
    this.dialogRef.close();
  }
  private submitForm(): void {
    console.log(this.form.value);
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      icon: 'art',
    });
  }
}
