import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatRadioChange, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { LessonService } from '../../../services/lesson/lesson.graphql.service';
import { Lesson } from '../../../models/lesson.model';
import { Location } from '../../../models/location.model';
import { ScheduleDialogData } from './schedule-dialog-data.model';
import { LocationService } from '../../../services/location/location.graphql.service';
import { Original } from '../../../models/timeslot.model';
import { DateUtilService } from '../../../services/date-utils/date-util.service';
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.html',
  styleUrls: ['./schedule-dialog.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  userChoose: string;
  baseState: Original = {};
  lessons: Lesson[];
  locations: Location[];
  selectedList: number[];
  selectedLesson: Lesson | undefined;
  selectedLocation: Location | undefined;
  selectedWeeks: number | undefined;
  isDisable = true;
  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public scheduleDialogData: ScheduleDialogData,
    private lessonService: LessonService,
    private locationService: LocationService,
    private dateUtilService: DateUtilService,
  ) {}

  private markWeekOnDropDown(date) {
    const week = this.dateUtilService.convertDateToWeek(date);
    if (week >= 1 && week <= 15) {
      this.userChoose = 'TemporaryChange';
      this.isDisable = false;
      this.selectedWeeks = week + 1;
    }
  }

  public buildTemparyObject(weeks: number) {
    this.baseState.expired = this.dateUtilService.convertWeekToDate(weeks);
  }

  public buildDropDownRange(end) {
    this.selectedList = [];
    for (let i = 1; i <= end; i++) {
      this.selectedList.push(i);
    }
  }

  public onTemorerySelectionChange(event: MatSelectChange) {
    this.buildTemparyObject(event.value);
    this.scheduleDialogData.original = this.baseState;
  }
  //saveState
  public radioChange(event: MatRadioChange) {
    if (event.value === 'TemporaryChange') {
      this.buildTemparyObject(1);
      this.scheduleDialogData.original = this.baseState;
      this.isDisable = false;
    } else {
      // the content of the modal is the permenent state
      this.scheduleDialogData.original = undefined;
      this.isDisable = true;
    }
  }

  private initSelectedLesson() {
    this.selectedLesson = this.lessons.find(
      (lesson) => (this.scheduleDialogData.lesson ? this.scheduleDialogData.lesson.title === lesson.title : false),
    );
    //save prev lesson state
    //if there is not temprery request yet save the local state
    //else save the real base state requeset
    if (!this.scheduleDialogData.original) {
      const lesson = Object.assign({}, this.selectedLesson);
      this.baseState.lesson = lesson;
    } else {
      this.baseState.lesson = this.scheduleDialogData.original.lesson;
    }
  }

  private initSelectedLocation() {
    this.selectedLocation = this.locations.find(
      (location) =>
        this.scheduleDialogData.location ? this.scheduleDialogData.location.name === location.name : false,
    );

    //save prev location state
    //if there is not temprery request yet save the local state
    //else save the real base state requeset
    if (!this.scheduleDialogData.original) {
      const location = Object.assign({}, this.selectedLocation);
      this.baseState.location = location;
    } else {
      this.baseState.location = this.scheduleDialogData.original.location;
    }
  }

  private calculateSelectedWeeks() {
    if (this.scheduleDialogData.original != null) {
      this.baseState.expired = this.scheduleDialogData.original.expired;
      this.markWeekOnDropDown(this.scheduleDialogData.original.expired);
    } else {
      this.userChoose = 'PermanentChange';
    }
  }

  async ngOnInit() {
    this.lessons = await this.lessonService.getLessons();
    this.locations = await this.locationService.getLocations();
    this.buildDropDownRange(15);
    this.initSelectedLesson();
    this.initSelectedLocation();
    this.calculateSelectedWeeks();
  }
}
