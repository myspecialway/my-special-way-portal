import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { TimeSlot } from '../../../models/timeslot.model';
import { LessonService } from '../../../services/lesson/lesson.service';
import { Lesson } from '../../../models/lesson.model';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.html',
  styleUrls: ['./schedule-dialog.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  // form: FormGroup;
  // formControl = new FormControl('', [Validators.required]);
  lessons: Lesson[];
  selected: Lesson;
  selectedId: string;

  constructor(
    // private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private lessonService: LessonService,
  ) {
    this.selected = this.data.lesson;
    this.selectedId = this.data.lesson ? this.data.lesson._id : '';
  }

  async ngOnInit() {
    // this.form = this.formBuilder.group({
    //   lesson: '',
    // });
    this.lessons = await this.lessonService.getLessons().then((res) => res.data.lessons);
  }

  // getErrorMessage(): string {
  //   return this.formControl.hasError('required') ? 'Required field' : '';
  // }

  close(): void {
    this.dialogRef.close();
  }

  confirm(dialogData): void {
    this.dialogRef.close(dialogData);
  }

  onChange(event: MatSelectChange) {
    const newId: string = event.value;
    const newLesson = this.lessons.find((lesson: Lesson) => lesson._id === newId);
    if (newLesson) {
      this.selected = newLesson;
    }
  }
}
