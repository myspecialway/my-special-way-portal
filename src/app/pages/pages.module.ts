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
  MAT_LABEL_GLOBAL_OPTIONS,
  MatListModule,
  MatSlideToggleModule,
  MatButtonModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { StudentDetailsComponent } from './student/details/student-details.component';
import { StudentDetailsPersonalInfoComponent } from './student/details/tabs/student-details-personal-info/student-details-personal-info.component';
import { StudentDetailsHoursComponent } from './student/details/tabs/student-details-hours/student-details-hours.component';
import { StudentDetailsNotificationsComponent } from './student/details/tabs/student-details-notifications/student-details-notifications.component';
import { MapContainerComponent } from './maps/maps.container/map.container.component';
import { MapViewComponent } from './maps/maps.view/map.view.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
  ],
  declarations: [
    StudentDetailsComponent,
    StudentDetailsPersonalInfoComponent,
    StudentDetailsHoursComponent,
    StudentDetailsNotificationsComponent,
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
    LessonComponent,
    MapContainerComponent,
    MapViewComponent,
  ],
  providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }],
})
export class PagesModule {}
