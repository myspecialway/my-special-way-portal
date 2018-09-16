import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsViewComponent } from './class-details/class-details.view/class-details.view.component';
import { ClassDetailsContainerComponent } from './class-details/class-details.container/class-details.container.component';
import { LessonComponent } from './lesson/lesson.component';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import {
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatButtonToggleModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { StudentDetailsComponent } from './student/details/student-details.component';
import { StudentDetailsPersonalInfoComponent } from './student/details/tabs/student-details-personal-info/student-details-personal-info.component';
import { StudentDetailsHoursComponent } from './student/details/tabs/student-details-hours/student-details-hours.component';
import { StudentDetailsNotificationsComponent } from './student/details/tabs/student-details-notifications/student-details-notifications.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
  ],
  declarations: [
    StudentDetailsComponent,
    StudentDetailsPersonalInfoComponent,
    StudentDetailsHoursComponent,
    StudentDetailsNotificationsComponent,
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
    LessonComponent,
  ],
})
export class PagesModule {}
