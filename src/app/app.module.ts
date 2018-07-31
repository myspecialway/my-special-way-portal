import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatIconModule,
  MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatRippleModule, MatSelectModule, MatSortModule,
  MatTableModule, MatTooltipModule, MatCheckboxModule, MatDividerModule,
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
import { StudentComponent } from './pages/student/student.component';
import { StudentService } from './pages/student/services/student.graphql.service';
import { DeleteClassDialogComponent } from './pages/class/dialogs/delete/delete-class.dialog';
import { AddStudentDialogComponent } from './pages/student/dialogs/add/add-student.dialog';
import { UserComponent } from './pages/user/user.component';
import { AddUserDialogComponent } from './pages/user/dialogs/add/add-user.dialog';
import { UserService } from './pages/user/services/user.graphql.service';
import { BrowserModule } from '@angular/platform-browser';
import { DeleteUserDialogComponent } from './pages/user/dialogs/delete/delete-user.dialog';
import { UpdateUserDialogComponent } from './pages/user/dialogs/update/update-user.dialog';
import { DeleteStudentDialogComponent } from './pages/student/dialogs/delete/delete-student.dialog';
import { ClassService } from './pages/class/services/class.graphql.service';
import { UpdateStudentDialogComponent } from './pages/student/dialogs/update/update-student.dialog';
import { AddClassDialogComponent } from './pages/class/dialogs/add/add-class.dialog';
import { UpdateClassDialogComponent } from './pages/class/dialogs/update/update-class.dialog';
import { MSWApolloModule } from './apollo/msw-apollo.module';
import { LessonComponent } from './pages/lesson/lesson.component';
import { LessonService } from './services/lesson/lesson.graphql.service';

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
    MatSortModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    AppRoutingModule,
    CdkTableModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDividerModule,
    MSWApolloModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ClassComponent,
    StudentComponent,
    UserComponent,
    LessonComponent,
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    AddStudentDialogComponent,
    UpdateStudentDialogComponent,
    DeleteStudentDialogComponent,
    AddClassDialogComponent,
    DeleteClassDialogComponent,
    UpdateClassDialogComponent,
  ],
  entryComponents: [
    AddUserDialogComponent,
    UpdateUserDialogComponent,
    DeleteUserDialogComponent,
    AddStudentDialogComponent,
    UpdateStudentDialogComponent,
    DeleteStudentDialogComponent,
    AddClassDialogComponent,
    DeleteClassDialogComponent,
    UpdateClassDialogComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    StudentService,
    ClassService,
    LessonService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
