import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ComponentsModule } from './components/components.module';
import {APP_BASE_HREF} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatRippleModule, MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';

import { AppRoutingModule } from './app.routing';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgmCoreModule } from '@agm/core';
import {AlertComponent} from './components/alert/alert.component';
import {AlertService} from './components/alert/services/alert.service';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from './services/auth.guard';
import {AuthenticationService} from './services/authentication.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './services/helpers/jwt.interceptor';
import {UserService} from './services/user.service';
import {fakeBackendProvider} from './services/helpers/fake-backend';
import {ClassComponent} from './pages/class/class.component';
import {ClassService} from './pages/class/services/class.service';
import {StudentComponent} from './pages/student/student.component';
import {StudentService} from './pages/student/services/studnet.service';
import {DeleteDialogComponent} from './pages/class/dialogs/delete/delete.dialog.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ComponentsModule,
        RouterTestingModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatPaginatorModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        AppRoutingModule,
        CdkTableModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        }),
        ApolloModule,
        HttpLinkModule
      ],
      declarations: [
        AppComponent,
        DashboardComponent,
        AlertComponent,
        LoginComponent,
        ClassComponent,
        StudentComponent,
        DeleteDialogComponent
      ],
      providers: [
        AlertService,
        AuthGuard,
        AuthenticationService,
        UserService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        ClassService,
        StudentService,
        // provider used to create fake backend
        fakeBackendProvider
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render "made with love" in footer', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.footer').textContent).toContain('Welcome to My-Special-W@@y!');
  }));
  it('should render "made with love" in footer', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.copyright').textContent).toContain('made with love');
  }));
});
