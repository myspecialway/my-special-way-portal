import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {CdkTableModule} from '@angular/cdk/table';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatRippleModule, MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { TableListComponent } from './table-list/table-list.component';
// import { TypographyComponent } from './typography/typography.component';
// import { IconsComponent } from './icons/icons.component';
// import { MapsComponent } from './maps/maps.component';
// import { NotificationsComponent } from './notifications/notifications.component';
// import { UpgradeComponent } from './upgrade/upgrade.component';
import { AgmCoreModule } from '@agm/core';
import {AlertComponent} from './components/alert/alert.component';
import {AlertService} from './components/alert/services/alert.service';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from './services/auth.guard';
import {AuthenticationService} from './services/authentication.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './services/helpers/jwt.interceptor';
import {UserService} from './services/user.service';
import {ClassComponent} from './pages/class/class.component';
import {fakeBackendProvider} from './services/helpers/fake-backend';
import {ClassService} from './pages/class/services/class.service';
import {StudentComponent} from './pages/student/student.component';
import {StudentService} from './pages/student/services/student.service';
// import {GradeComponent} from "./pages/grade/grade.component";
// import {HttpClientModule} from "@angular/common/http";
// import {DeleteDialogComponent} from "./pages/grade/dialogs/delete/delete.dialog.component";
// import {DataService} from "./pages/grade/services/data.service";
// import {LoginComponent} from "./pages/login/login.component";
// import {AuthenticationService} from "./services/authentication.service";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ComponentsModule,
    RouterModule,
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
    })
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AlertComponent,
    LoginComponent,
    ClassComponent,
    StudentComponent
    // DeleteDialogComponent,
    // LoginComponent
    // UserProfileComponent,
    // TableListComponent,
    // TypographyComponent,
    // IconsComponent,
    // MapsComponent,
    // NotificationsComponent,
    // UpgradeComponent,

  ],
  entryComponents: [
    // AddDialogComponent,
    // EditDialogComponent,
    // DeleteDialogComponent
  ],
  providers: [
    AlertService,
    AuthGuard,
    AuthenticationService,
    UserService,
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

  bootstrap: [AppComponent]
})
export class AppModule { }
