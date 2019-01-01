import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateUtilService {
  constructor() {}

  public convertDateToWeek(date) {
    const week = moment(date)
      .utc()
      .diff(moment().utc(), 'weeks');
    console.log(week);
    return week;
  }

  public convertWeekToDate(weeks: number) {
    const date = moment()
      .add(weeks, 'weeks')
      .utc()
      .toISOString();
    console.log(date);
    return date;
  }
}
