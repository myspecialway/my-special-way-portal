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
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  messages: String = '';
  constructor(private apollo: Apollo) { }

      ngOnInit() {
         this.apollo.query<any>({
            query: MessageQuery
        }).subscribe(x => this.messages = x.data.message);

      }

  }


