import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsViewComponent } from './class-details/class-details.view/class-details.view.component';
import { ClassDetailsContainerComponent } from './class-details/class-details.container/class-details.container.component';
// import { LessonComponent } from './lesson/lesson.component';
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
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatAutocompleteModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { StudentDetailsComponent } from './student/details/student-details.component';
import { StudentDetailsPersonalInfoComponent } from './student/details/tabs/student-details-personal-info/student-details-personal-info.component';
import { StudentDetailsHoursComponent } from './student/details/tabs/student-details-hours/student-details-hours.component';
import { StudentDetailsRemindersComponent } from './student/details/tabs/student-details-reminders/student-details-reminders.component';
import { MapContainerComponent } from './maps/maps.container/map.container.component';
import { MapViewComponent } from './maps/maps.view/map.view.component';
import { UniqueUsernameValidatorDirective } from '../directives/unique-username-validator.directive';
import { MapsContainerComponent } from './maps/maps.container/maps.container.component';
import { MapPointsComponent } from './maps/maps.container/tabs/map-points/map-points.component';
import { MapPointsViewComponent } from './maps/maps.container/tabs/map-points/maps-points.view/map-points.view.component';
import { MapFloorListComponent } from './maps/maps.container/tabs/map-floor-list/map-floor-list.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    // MatDialog,
    MatTableModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
  declarations: [
    StudentDetailsComponent,
    StudentDetailsPersonalInfoComponent,
    StudentDetailsHoursComponent,
    StudentDetailsRemindersComponent,
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
    MapContainerComponent,
    MapsContainerComponent,
    MapViewComponent,
    MapPointsComponent,
    MapPointsViewComponent,
    UniqueUsernameValidatorDirective,
    MapFloorListComponent,
  ],
  providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PagesModule {}
