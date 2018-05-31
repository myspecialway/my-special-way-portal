import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Message, Query } from '../../app.types';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { resultKeyNameFromField } from 'apollo-utilities';


const MessageQuery = gql`
{
  message
}
`;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  messages: String = '';
  constructor(private apollo: Apollo) { }

      ngOnInit() {
         this.apollo.query<any>({
            query: MessageQuery
        }).subscribe(x => this.messages = x.data.message);

      }

  }
