import { MapsContainerComponent } from './pages/maps/maps.container/maps.container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './services/authentication/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { StudentComponent } from './pages/student/student.component';
import { ClassComponent } from './pages/class/class.component';
import { UserComponent } from './pages/user/user.component';
import { ClassDetailsContainerComponent } from './pages/class-details/class-details.container/class-details.container.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { StudentDetailsHoursComponent } from './pages/student/details/tabs/student-details-hours/student-details-hours.component';
import { StudentDetailsPersonalInfoComponent } from './pages/student/details/tabs/student-details-personal-info/student-details-personal-info.component';
import { StudentDetailsComponent } from './pages/student/details/student-details.component';
import { StudentDetailsRemindersComponent } from './pages/student/details/tabs/student-details-reminders/student-details-reminders.component';
import { UserType } from './models/user.model';
import { FirstloginComponent } from './pages/firstlogin/firstlogin.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SentSuccessfullyComponent } from './pages/sent-successfully/sent-successfully.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NonActiveTimeComponent } from './pages/non-active-time/non-active-time.component';

const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'sent-successfully', component: SentSuccessfullyComponent },
  {
    path: 'first-login/:token',
    component: FirstloginComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      expectedRole: [UserType.TEACHER, UserType.PRINCIPLE],
    },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'class',
        component: ClassComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'class/:idOrNew',
        component: ClassDetailsContainerComponent,
        data: { expectedRole: [UserType.TEACHER, UserType.PRINCIPLE] },
      },
      {
        path: 'student',
        component: StudentComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.TEACHER, UserType.PRINCIPLE] },
      },
      {
        path: 'student/:idOrNew',
        component: StudentDetailsComponent,
        children: [
          { path: 'personalInfo', component: StudentDetailsPersonalInfoComponent },
          { path: 'hours', component: StudentDetailsHoursComponent },
          { path: 'reminders', component: StudentDetailsRemindersComponent },
          { path: '', component: StudentDetailsPersonalInfoComponent },
        ],
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.TEACHER, UserType.PRINCIPLE] },
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'lesson',
        component: LessonComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'maps',
        component: MapsContainerComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'non-active-times',
        component: NonActiveTimeComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.PRINCIPLE] },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
