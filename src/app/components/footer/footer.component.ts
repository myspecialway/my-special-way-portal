import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Message, Query } from '../../app.types';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  messages: Observable<Message[]>;
  constructor(private apollo: Apollo) { }


  ngOnInit() {
    this.messages = this.apollo.watchQuery<Query>({
      query: gql`
        query {
          message
        }
      `
    })
      .valueChanges
      .pipe(
        map(result => result.data.allMessages)
      );
  }

}
