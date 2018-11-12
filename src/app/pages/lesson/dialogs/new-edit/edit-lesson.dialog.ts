import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Lesson } from '../../../../models/lesson.model';

@Component({
  selector: 'app-edit-lesson.dialog',
  templateUrl: './edit-lesson.dialog.html',
  styleUrls: ['./edit-lesson.dialog.scss'],
})
export class EditLessonDialogComponent implements OnInit {
  public updateButtonTitle = 'עדכן';
  public addButtonTitle = 'הוסף';

  public icons = ['english', 'art', 'lunch', 'hebrew', 'therapy', 'breakfeast', 'english2', 'arabic', 'russian'];
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lesson,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  public onIconClick(selectedIcon: string): void {
    this.data.icon = selectedIcon;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      icon: '',
    });
  }
}
