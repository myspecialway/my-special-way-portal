import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatDividerModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatRadioModule,
  MatDatepickerModule,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MapFloorListComponent } from './pages/maps/maps.container/tabs/map-floor-list/map-floor-list.component';
import { MapPointsViewComponent } from './pages/maps/maps.container/tabs/map-points/maps-points.view/map-points.view.component';
import { MapPointsComponent } from './pages/maps/maps.container/tabs/map-points/map-points.component';
import { AddEditPointDialogComponent } from './pages/maps/maps.container/dialogs/add-edit-point/add-edit-point.dialog';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/authentication/auth.guard';
import { AuthenticationService } from './services/authentication/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { PapaParseModule } from 'ngx-papaparse';
import { ClassComponent } from './pages/class/class.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { StudentComponent } from './pages/student/student.component';
import { StudentService } from './pages/student/services/student.service';
import { DeleteClassDialogComponent } from './pages/class/dialogs/delete/delete-class.dialog';
import { AddStudentDialogComponent } from './pages/student/dialogs/add/add-student.dialog';
import { UserComponent } from './pages/user/user.component';
import { AddUserDialogComponent } from './pages/user/dialogs/add/add-user.dialog';
import { UserService } from './pages/user/services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { UserDetailsFormComponent } from './pages/user/dialogs/base/user-details-form/user-details-form';
import { DeleteUserDialogComponent } from './pages/user/dialogs/delete/delete-user.dialog';
import { UpdateUserDialogComponent } from './pages/user/dialogs/update/update-user.dialog';
import { DeleteStudentDialogComponent } from './pages/student/dialogs/delete/delete-student.dialog';
import { ClassService } from './pages/class/services/class.graphql.service';
import { LessonService } from './services/lesson/lesson.graphql.service';
import { UpdateStudentDialogComponent } from './pages/student/dialogs/update/update-student.dialog';
import { MSWApolloModule } from './apollo/msw-apollo.module';
import { PagesModule } from './pages/pages.module';
import { ScheduleDialogComponent } from './components/schedule/schedule-dialog/schedule.dialog';
import { ScheduleService } from './services/schedule/schedule.service';
import { LocationService } from './services/location/location.graphql.service';
import { MSWSnackbar } from './services/msw-snackbar/msw-snackbar.service';
import { PendingInterceptorServiceInterceptor } from './services/spinner/pending-interceptor.service';
import { DeleteLessonDialogComponent } from './pages/lesson/dialogs/delete/delete-lesson.dialog';
import { CantDeleteLessonDialogComponent } from './pages/lesson/dialogs/cant-delete/cant-delete-lesson.dialog';
import { FirstloginComponent } from './pages/firstlogin/firstlogin.component';
import { SessionHeaderComponent } from './pages/shared/session-mgmt/session-header/session-header.component';
import { SessionFooterComponent } from './pages/shared/session-mgmt/session-footer/session-footer.component';
import { AddStudentReminderDialogComponent } from './pages/student/dialogs/reminders/add/add-student-reminder.dialog';
import { EditLessonDialogComponent } from './pages/lesson/dialogs/new-edit/edit-lesson.dialog';
import { RestorePasswordDialogComponent } from './pages/user/dialogs/restore/success/restore.dialog';
import { RestorePasswordErrorDialogComponent } from './pages/user/dialogs/restore/error/restore-error.dialog';
import { ExitSystemDialogComponent } from './components/navbar/dialogs/exit/exit-system.dialog';
import { MapsService } from './pages/maps/maps.container/services/maps.container.service';
import { MapsContainerComponent } from './pages/maps/maps.container/maps.container.component';
import { DeleteBlockDialogComponent } from './pages/maps/maps.container/dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './pages/maps/maps.container/dialogs/add-update/add-update-block.dialog';
import { AddMapDialogComponent } from './pages/maps/maps.container/dialogs/add-map/add-map.dialog';
import { FileUploadModule } from 'ng2-file-upload';
import { EditNonActiveTimeDialogComponent } from './pages/non-active-time/dialogs/edit/edit-non-active-time.dialog';
import { NonActiveTimeService } from './services/non-active-time/non-active-time.graphql.service';
import { DeleteNonActiveTimeDialogComponent } from './pages/non-active-time/dialogs/delete/delete-non-active-time-dialogue.component';
import { ErrorDialogComponent } from './pages/common/error-dialog/error.dialog';
import { DeleteTimeSlotDialogComponent } from './components/schedule/delete-schedule-dialog/delete-time-slot.dialog';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FileUploadModule,
    BrowserModule,
    FormsModule,
    ComponentsModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSortModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatButtonToggleModule,
    AppRoutingModule,
    CdkTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MSWApolloModule,
    PagesModule,
    MatRadioModule,
    PapaParseModule,
  ],
  declarations: [
    AppComponent,
    ErrorDialogComponent,
    DashboardComponent,
    LoginComponent,
    ClassComponent,
    LessonComponent,
    StudentComponent,
    MapsContainerComponent,
    MapPointsComponent,
    MapPointsViewComponent,
    MapFloorListComponent,
    UserComponent,
    FirstloginComponent,
    UserDetailsFormComponent,
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    RestorePasswordDialogComponent,
    RestorePasswordErrorDialogComponent,
    AddStudentDialogComponent,
    AddStudentReminderDialogComponent,
    UpdateStudentDialogComponent,
    DeleteStudentDialogComponent,
    DeleteBlockDialogComponent,
    AddUpdateBlockDialogComponent,
    AddMapDialogComponent,
    DeleteLessonDialogComponent,
    AddEditPointDialogComponent,
    EditLessonDialogComponent,
    CantDeleteLessonDialogComponent,
    DeleteClassDialogComponent,
    ScheduleDialogComponent,
    SessionHeaderComponent,
    SessionFooterComponent,
    ExitSystemDialogComponent,
    DeleteNonActiveTimeDialogComponent,
    EditNonActiveTimeDialogComponent,
    DeleteTimeSlotDialogComponent,
  ],
  entryComponents: [
    ErrorDialogComponent,
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    RestorePasswordDialogComponent,
    RestorePasswordErrorDialogComponent,
    AddStudentDialogComponent,
    AddStudentReminderDialogComponent,
    AddUpdateBlockDialogComponent,
    AddEditPointDialogComponent,
    UpdateStudentDialogComponent,
    DeleteStudentDialogComponent,
    DeleteBlockDialogComponent,
    AddUpdateBlockDialogComponent,
    AddMapDialogComponent,
    DeleteClassDialogComponent,
    DeleteLessonDialogComponent,
    EditLessonDialogComponent,
    CantDeleteLessonDialogComponent,
    ScheduleDialogComponent,
    ExitSystemDialogComponent,
    DeleteNonActiveTimeDialogComponent,
    EditNonActiveTimeDialogComponent,
    DeleteTimeSlotDialogComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    StudentService,
    MapsService,
    ClassService,
    LessonService,
    ScheduleService,
    LocationService,
    MSWSnackbar,
    PendingInterceptorServiceInterceptor,
    NonActiveTimeService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
