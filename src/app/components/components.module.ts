import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleDialogComponent } from './schedule/schedule-dialog/schedule.dialog';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    ScheduleComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    ScheduleComponent,
  ],
})

export class ComponentsModule { }
