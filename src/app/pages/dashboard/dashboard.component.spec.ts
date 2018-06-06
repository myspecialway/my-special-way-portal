import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { RouterModule } from '@angular/router';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ApolloModule } from 'apollo-angular';

describe('dashboard component', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
      ],
      imports: [ApolloModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture).toMatchSnapshot();
  });
});
