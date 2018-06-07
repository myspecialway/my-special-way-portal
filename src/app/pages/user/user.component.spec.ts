import { UserComponent } from './user.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatHeaderRowDef, MatDialogModule, MatRowDef} from '@angular/material';
import {UserService} from './services/user.service';
import {HttpClientModule} from '@angular/common/http';
import {Shallow} from 'shallow-render';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {ComponentsModule} from '../../components/components.module';
import {AppModule} from '../../app.module';
describe('dashboard component', () => {
  let shallow: Shallow<UserComponent>;
  beforeEach(async () => {
    shallow = new Shallow(UserComponent, AppModule);
  });

  it('should render component as described in snapshot', () => {
    const userComponent = shallow.render('<app-user></app-user>');
    expect(userComponent).toMatchSnapshot();
  });
});
