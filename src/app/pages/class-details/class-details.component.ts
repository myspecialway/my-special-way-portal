import { Component, OnInit } from '@angular/core';
import { ClassService } from '../class/services/class.graphql.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApolloQueryResult } from 'apollo-client';
import { ClassQuery, Class } from '../../models/class.model';
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
})
export class ClassDetailsComponent implements OnInit {
  class$: Observable<ApolloQueryResult<ClassQuery>>;
  headers = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
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
  schedule;
  scheduleMap: Map<string, string> = new Map();
  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.className = this.route.snapshot.params.name;
    this.classService.classByName(this.className).subscribe(
      ((res) => {
        console.log(res.data);
      }),
    );

    // create schedule grid - refactor to service or another component
    this.createSchedule();
  }

  createSchedule() {
    this.schedule = {
      headers: this.headers,
      body: [],
    };
    // TODO: refactor this
    for (let row = 0; row < this.hours.length; row++) {
      this.schedule.body[row] = new Array(this.headers.length);
      for (let col = 0; col < this.headers.length; col++) {
        const gridItem = {
          index: `${row}${col}`,
          title: '',
        };
        this.schedule.body[row][col] = gridItem;
      }
    }
    console.log(this.schedule);
  }

}
