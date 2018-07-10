import { Component, OnInit } from '@angular/core';
import { ClassService } from '../class/services/class.graphql.service';
import { ActivatedRoute } from '@angular/router';
import { ClassQuery, Class, TimeSlot } from '../../models/class.model';
import { scheduleTestData } from '../../../mocks/assets/schedule.mock';
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
})
export class ClassDetailsComponent implements OnInit {
  // TODO: extract to config or service
  days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  hours = [
    '07:30 - 08:00',
    '08:00 - 08:50',
    '08:50 - 09:35',
    '09:35 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:15',
    '11:15 - 12:00',
    '12:00 - 12:45',
    '12:45 - 13:15',
    '13:15 - 13:45',
    '13:45 - 14:30',
    '14:30 - 15:15',
    '15:15 - 16:00',
    '16:00 - 16:30',
    '16:30 - 16:45',
  ];
  className: string;
  _class;
  schedule;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // this.className = this.route.snapshot.params.name;
    // this.classService.classByName(this.className).map((res) => res.data.classByName).subscribe(
    //   ((classData: any) => { // TODO: need to change to TimeSlot[]
    //     this._class = classData;
    //     this.createSchedule(classData.schedule);
    //   }),
    // );
    this.createSchedule(scheduleTestData);
  }

  createSchedule(scheduleArr: TimeSlot[]) {
    const numHours = this.hours.length;
    const numDays = this.days.length;
    this.schedule = Array(numHours);
    for (let hour = 0; hour < numHours; hour++) {
      this.schedule[hour] = Array(numDays);
      for (let day = 0; day < numDays; day++) {
        this.schedule[hour][day] = null;
      }
    }
    scheduleArr.forEach((ts: TimeSlot) => {
      const row = ts.index.substr(0, ts.index.length - 1);
      const col = ts.index.substr(-1);
      this.schedule[row][col] = ts.lesson;
    });
  }

}
