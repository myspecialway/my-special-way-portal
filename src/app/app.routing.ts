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
import {StudentDetailsComponent} from './pages/student/details/student-details.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'class', component: ClassComponent, canActivate: [AuthGuard] },
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'student', pathMatch: 'full' },
  { path: 'student/new', component: StudentDetailsComponent},
  { path: 'student/:id', component: StudentDetailsComponent},
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
