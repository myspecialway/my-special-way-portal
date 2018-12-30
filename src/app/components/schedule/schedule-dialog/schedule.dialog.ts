import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatRadioChange, MAT_DIALOG_DATA } from '@angular/material';
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
  selectedList: number[];
  selectedLesson: Lesson | undefined;
  selectedLocation: Location | undefined;
  selectedWeeks: string | undefined;
  isDisable = true;
  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public scheduleDialogData: ScheduleDialogData,
    private lessonService: LessonService,
    private locationService: LocationService) {
  }
  public radioChange(event: MatRadioChange) {
    console.log(event);
    if (event.value === "TemporaryChange") {
      this.isDisable = false;
    } else {
      this.isDisable = true;
    }
  }
  public range(end) {
    this.selectedList = [];
    for (let i = 0; i <= end; i++) {
      this.selectedList.push(i);
    }
  }
  async ngOnInit() {
    this.lessons = await this.lessonService.getLessons();
    this.locations = await this.locationService.getLocations();
    this.range(15);
    this.selectedLesson = this.lessons.find(
      (lesson) => (this.scheduleDialogData.lesson ? this.scheduleDialogData.lesson.title === lesson.title : false),
    );

    this.selectedLocation = this.locations.find(
      (location) =>
        this.scheduleDialogData.location ? this.scheduleDialogData.location.name === location.name : false,
    );
  }
}
