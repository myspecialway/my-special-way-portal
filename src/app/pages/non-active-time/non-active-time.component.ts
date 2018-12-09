import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Lesson } from '../../models/lesson.model';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Subscription } from 'rxjs';
import { NonActiveTimeService } from '../../services/non-active-time/non-active-time.graphql.service';
import { NonActiveTime } from '../../models/non-active-time.model';

@Component({
  selector: 'app-non-active-time',
  templateUrl: './non-active-time.component.html',
  styleUrls: ['./non-active-time.component.scss'],
})
export class NonActiveTimeComponent implements OnInit {
  displayedColumns = ['title', 'icon', 'deleteLesson'];
  dataSource = new MatTableDataSource<NonActiveTime>();

  @ViewChild(MatSort)
  sort: MatSort;

  @SubscriptionCleaner()
  subCollector: Subscription;

  constructor(private nonActiveTimeService: NonActiveTimeService) {}

  async ngOnInit() {
    try {
      this.subCollector.add(
        this.nonActiveTimeService.getAllNonActiveTimes().subscribe((nonActiveTimes) => {
          if (nonActiveTimes !== null) {
            console.log('I am here 1');
            this.dataSource.data = [...nonActiveTimes];
          } else {
            console.log('I am here 2');
            this.dataSource.data = [];
          }
        }),
      );
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error getting non active times');
      throw error;
    }
  }
}
