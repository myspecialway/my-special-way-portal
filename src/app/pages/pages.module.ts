import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsViewComponent } from './class-details/class-details.view/class-details.view.component';
import { ClassDetailsContainerComponent } from './class-details/class-details.container/class-details.container.component';
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
  MatRadioModule,
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { StudentDetailsComponent } from './student/details/student-details.component';
import { StudentDetailsPersonalInfoComponent } from './student/details/tabs/student-details-personal-info/student-details-personal-info.component';
import { StudentDetailsHoursComponent } from './student/details/tabs/student-details-hours/student-details-hours.component';
import { StudentDetailsRemindersComponent } from './student/details/tabs/student-details-reminders/student-details-reminders.component';
import { NonActiveTimeComponent } from './non-active-time/non-active-time.component';
import { UsernameValidatorDirective } from '../directives/username-validator/username-validator.directive';
import { PasswordValidatorDirective } from '../directives/password-validator/password-validator.directive';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FileImportModule } from '../file-import/file-import.module';
import { SentSuccessfullyComponent } from './sent-successfully/sent-successfully.component';

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
    MatTableModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatIconModule,
    FileImportModule,
    MatRadioModule,
  ],
  declarations: [
    StudentDetailsComponent,
    StudentDetailsPersonalInfoComponent,
    StudentDetailsHoursComponent,
    StudentDetailsRemindersComponent,
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
    NonActiveTimeComponent,
    UsernameValidatorDirective,
    PasswordValidatorDirective,
    ResetPasswordComponent,
    SentSuccessfullyComponent,
  ],
  providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PagesModule {}
