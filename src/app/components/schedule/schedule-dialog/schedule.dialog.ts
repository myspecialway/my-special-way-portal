import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { LessonService } from '../../../services/lesson/lesson.service';
import { Lesson } from '../../../models/lesson.model';
import { Location } from '../../../models/location.model';
import { ScheduleDialogData } from './schedule-dialog-data.model';
// import { LocationService } from '../../../services/location/location.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.html',
  styleUrls: ['./schedule-dialog.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  form: FormGroup;
  lessons: Lesson[];
  locations: Location[];

  get lessonGroup() { return this.form.get('lesson'); }
  get locationGroup() { return this.form.get('location'); }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleDialogData,
    private lessonService: LessonService,
    // private locationService: LocationService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getLessons();
  }

  createForm(): void {
    const selectedLessonId = this.data.lesson ? this.data.lesson._id : null;
    // const selectedLocationId = this.data.location ? this.data.location._id : null;
    this.form = this.fb.group({
      lesson: new FormControl(selectedLessonId, [Validators.required]),
      // location: new FormGroup(selectedLocationId, [Validators.required]),
    });
  }

  async getLessons(): Promise<void> {
    this.lessons = await this.lessonService.getLessons().then((res) => res.data.lessons);
  }

  async getLocations(): Promise<void> {
    // this.locations = await this.locationService.getLocations().then((res) => res.data.locations);
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(this.data);
  }

  onChange(event: MatSelectChange): void {
    const newId: string = event.value;
    const newLesson = this.lessons.find((lesson: Lesson) => lesson._id === newId);
    if (newLesson) {
      this.data.lesson = newLesson;
    }
  }
}
