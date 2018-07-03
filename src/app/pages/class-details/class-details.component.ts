import { Component, OnInit } from '@angular/core';
import { ClassService } from '../class/services/class.graphql.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApolloQueryResult } from 'apollo-client';
import { ClassQuery } from '../../models/class.model';
@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss'],
})
export class ClassDetailsComponent implements OnInit {
  class$: Observable<ApolloQueryResult<ClassQuery>>;
  className: string;
  days = ['שעה', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  dataSource = [];
  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.className = this.route.snapshot.params.name;
    // or maybe go to the observable way?
    //  this.class$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => this.classService.classByName(params.get('name'))));
    this.class$ = this.classService.classByName(this.className).subscribe(
      (data) => console.log(data)
    );
    console.log(this.class$);
    // this.classService.classByName
  }

}
