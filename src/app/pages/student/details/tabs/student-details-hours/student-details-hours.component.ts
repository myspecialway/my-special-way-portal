import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../../../../services/schedule/schedule.service';
import { StudentService } from '../../../services/student.service';
import { TimeSlot } from '../../../../../models/timeslot.model';
import Student, { StudentQuery } from '../../../../../models/student.model';
import { TimeSlotIndexes } from '../../../../../components/schedule/schedule.component';
import { ScheduleDialogData } from '../../../../../components/schedule/schedule-dialog/schedule-dialog-data.model';
import { MatDialog } from '@angular/material';
import { ScheduleDialogComponent } from '../../../../../components/schedule/schedule-dialog/schedule.dialog';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { Class } from '../../../../../models/class.model';
import { DeleteTimeSlotDialogComponent } from '../../../../../components/schedule/delete-schedule-dialog/delete-time-slot.dialog';

@Component({
  selector: 'app-student-details-hours',
  templateUrl: './student-details-hours.component.html',
  styleUrls: ['./student-details-hours.component.scss'],
})
export class StudentDetailsHoursComponent implements OnInit {
  sub: any;
  id: string;
  schedule: TimeSlot[][];
  student: Student;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private route: ActivatedRoute,
    public scheduleService: ScheduleService,
    private studentService: StudentService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    if (!this.route.parent) {
      return;
    }
    this.id = this.route.parent.snapshot.params.idOrNew;
    try {
      this.student = { ...(await this.studentService.getById(this.id)) };
      if (!this.student.class) {
        this.student.class = new Class();
      }
      this.initSchedule();
    } catch (err) {
      throw err;
    }
  }

  private initSchedule() {
    const schedule = this.student.schedule || [];
    this.schedule = this.scheduleService.buildScheduleFromTimeslots(
      this.scheduleService.hoursLabels.length,
      this.scheduleService.daysLabels.length,
      schedule,
    );
  }

  onTimeSlotClick(indexes: TimeSlotIndexes) {
    const dialogData = this.getDialogData(indexes);

    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: dialogData,
      height: '375px',
      width: '320px',
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (newData: ScheduleDialogData) => {
          if (!newData) {
            return;
          }
          const onlyCustomizedSlots: TimeSlot[] = this.student.schedule.filter((oldSLot) =>
            this.isSlotRelevant(oldSLot, newData),
          );
          const newCustomizedSlot: TimeSlot = {
            index: newData.index,
            hours: newData.hour,
            lesson: newData.lesson,
            location: newData.location,
            customized: true,
          };
          const newCustomizedSchedule = [...onlyCustomizedSlots, newCustomizedSlot];

          const tempStudent: StudentQuery = {
            _id: this.student._id,
            username: this.student.username,
            firstname: this.student.firstname,
            lastname: this.student.lastname,
            gender: this.student.gender,
            password: this.student.password,
            class_id: this.student.class._id,
            schedule: newCustomizedSchedule,
          };
          try {
            await this.studentService.update(tempStudent);
            this.student = await this.studentService.getById(this.id);
            this.initSchedule();
          } catch (error) {
            console.log(error);
          }
        }),
    );
  }

  isSlotRelevant(slot: TimeSlot, data: ScheduleDialogData) {
    return slot.customized && slot.index !== data.index;
  }

  getDialogData(indexes: TimeSlotIndexes) {
    const { hourIndex, dayIndex } = indexes;

    return {
      index: `${hourIndex}_${dayIndex}`,
      lesson: this.schedule[hourIndex][dayIndex].lesson,
      location: this.schedule[hourIndex][dayIndex].location,
      hour: this.scheduleService.hoursLabels[hourIndex],
      day: this.scheduleService.daysLabels[dayIndex],
    } as ScheduleDialogData;
  }

  onTimeSlotDelete(indexes: TimeSlotIndexes) {
    const dialogData = this.getDialogData(indexes);
    const dialogRef = this.dialog.open(DeleteTimeSlotDialogComponent, {
      data: dialogData,
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (shouldDelete: ScheduleDialogData) => {
          if (!shouldDelete) {
            return;
          }

          const onlyCustomizedSlots: TimeSlot[] = this.student.schedule.filter(
            (timeSlot) => timeSlot.customized === true && timeSlot.index !== `${indexes.hourIndex}_${indexes.dayIndex}`,
          );

          const tempStudent: StudentQuery = {
            _id: this.student._id,
            username: this.student.username,
            firstname: this.student.firstname,
            lastname: this.student.lastname,
            gender: this.student.gender,
            password: this.student.password,
            class_id: this.student.class._id,
            schedule: onlyCustomizedSlots,
          };
          try {
            await this.studentService.update(tempStudent);
            this.student = await this.studentService.getById(this.id);
            this.initSchedule();
          } catch (error) {
            console.log(error);
          }
        }),
    );
  }
}
