import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../../../../services/schedule/schedule.service';
import { StudentService } from '../../../services/student.graphql.service';
import { TimeSlot } from '../../../../../models/timeslot.model';
import Student from '../../../../../models/student.model';

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

  constructor(
    private route: ActivatedRoute,
    public scheduleService: ScheduleService,
    private studentService: StudentService,
  ) { }

  async ngOnInit() {
    if (!this.route.parent) {
      return;
    }
    this.id = this.route.parent.snapshot.params.idOrNew;
    try {
      this.student = await this.studentService.getById(this.id);
      this.initSchedule();
    } catch (err) {
      console.log(err);
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
    console.log(this.schedule);
  }
}
