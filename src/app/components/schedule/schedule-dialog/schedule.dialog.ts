import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { LessonService } from '../../../services/lesson/lesson.graphql.service';
import { Lesson } from '../../../models/lesson.model';
import { Location } from '../../../models/location.model';
import { ScheduleDialogData } from './schedule-dialog-data.model';
// TBD
// import { LocationService } from '../../../services/location/location.graphql.service';

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
    @Inject(MAT_DIALOG_DATA) public scheduleDialogData: ScheduleDialogData,
    private lessonService: LessonService,
    // TBD
    // private locationService: LocationService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getLessons();
  }

  private createForm(): void {
    const selectedLessonId = this.scheduleDialogData.lesson ? this.scheduleDialogData.lesson._id : null;
    // TBD
    // const selectedLocationId = this.scheduleDialogData.location ? this.scheduleDialogData.location._id : null;
    this.form = this.fb.group({
      lesson: new FormControl(selectedLessonId, [Validators.required]),
      // TBD
      // location: new FormGroup(selectedLocationId, [Validators.required]),
    });
  }

  private async getLessons(): Promise<void> {
    this.lessons = await this.lessonService.getLessons();
  }
  // TBD
  // async getLocations(): Promise<void> {
  //   this.locations = await this.locationService.getLocations().then((res) => res.data.locations);
  // }

  onChange(event: MatSelectChange): void {
    const newId: string = event.value;
    const newLesson = this.lessons.find((lesson: Lesson) => lesson._id === newId);
    if (newLesson) {
      this.scheduleDialogData.lesson = newLesson;
    } else {
      return;
    }
  }
}
