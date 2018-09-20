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
import { StudentDetailsNotificationsComponent } from './pages/student/details/tabs/student-details-notifications/student-details-notifications.component';
import { UserType } from './models/user.model';

const routes: Routes = [
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      expectedRole: [UserType.TEACHER, UserType.PRINCIPLE],
    },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'class', component: ClassComponent },
      { path: 'class/:idOrNew', component: ClassDetailsContainerComponent },
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
          { path: 'notifications', component: StudentDetailsNotificationsComponent },
          { path: '', component: StudentDetailsPersonalInfoComponent },
        ],
      },
      { path: 'user', component: UserComponent },
      {
        path: 'lesson',
        component: LessonComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: [UserType.TEACHER, UserType.PRINCIPLE] },
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
