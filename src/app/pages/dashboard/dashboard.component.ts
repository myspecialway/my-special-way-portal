import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';

const MessageQuery = gql`
  {
    message
  }
`;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  messages = '';
  constructor(private apollo: Apollo) {}

  @SubscriptionCleaner()
  subCollector;

  ngOnInit() {
    this.subCollector.add(
      this.apollo
        .query<any>({
          query: MessageQuery,
        })
        .subscribe((x) => (this.messages = x.data.message)),
    );
  }
}
