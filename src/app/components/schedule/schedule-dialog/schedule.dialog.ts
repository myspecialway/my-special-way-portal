import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LessonService } from '../../../services/lesson/lesson.graphql.service';
import { Lesson } from '../../../models/lesson.model';
import { Location } from '../../../models/location.model';
import { ScheduleDialogData } from './schedule-dialog-data.model';
import { LocationService } from '../../../services/location/location.graphql.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.html',
  styleUrls: ['./schedule-dialog.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  lessons: Lesson[];
  locations: Location[];
  selectedLesson: Lesson | undefined;
  selectedLocation: Location | undefined;

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public scheduleDialogData: ScheduleDialogData,
    private lessonService: LessonService,
    private locationService: LocationService,
  ) {}

  async ngOnInit() {
    this.lessons = await this.lessonService.getLessons();
    this.locations = await this.locationService.getLocations();

    this.selectedLesson = this.lessons.find(
      (lesson) => (this.scheduleDialogData.lesson ? this.scheduleDialogData.lesson.title === lesson.title : false),
    );

    this.selectedLocation = this.locations.find(
      (location) =>
        this.scheduleDialogData.location ? this.scheduleDialogData.location.name === location.name : false,
    );
  }
}
