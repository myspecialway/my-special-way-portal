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
} from '@angular/material';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/authentication/auth.guard';
import { AuthenticationService } from './services/authentication/authentication.service';
import { HttpClientModule } from '@angular/common/http';

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
import { AddStudentReminderDialogComponent } from './pages/student/dialogs/reminders/add/add-student-reminder.dialog';
import { EditLessonDialogComponent } from './pages/lesson/dialogs/new-edit/edit-lesson.dialog';
import { RestorePasswordDialogComponent } from './pages/user/dialogs/restore/success/restore.dialog';
import { RestorePasswordErrorDialogComponent } from './pages/user/dialogs/restore/error/restore-error.dialog';
import { ExitSystemDialogComponent } from './components/navbar/dialogs/exit/exit-system.dialog';
import { NonActiveTimeService } from './services/non-active-time/non-active-time.graphql.service';
@NgModule({
  imports: [
    BrowserAnimationsModule,
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
    AppRoutingModule,
    CdkTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MSWApolloModule,
    PagesModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ClassComponent,
    LessonComponent,
    StudentComponent,
    UserComponent,
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
    DeleteLessonDialogComponent,
    EditLessonDialogComponent,
    CantDeleteLessonDialogComponent,
    DeleteClassDialogComponent,
    ScheduleDialogComponent,
    ExitSystemDialogComponent,
  ],
  entryComponents: [
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    RestorePasswordDialogComponent,
    RestorePasswordErrorDialogComponent,
    AddStudentDialogComponent,
    AddStudentReminderDialogComponent,
    UpdateStudentDialogComponent,
    DeleteStudentDialogComponent,
    DeleteClassDialogComponent,
    DeleteLessonDialogComponent,
    EditLessonDialogComponent,
    CantDeleteLessonDialogComponent,
    ScheduleDialogComponent,
    ExitSystemDialogComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    StudentService,
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
