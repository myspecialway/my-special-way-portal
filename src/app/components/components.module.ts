import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SharedModule } from '../shared.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, MatProgressSpinnerModule, HttpClientModule],
  declarations: [FooterComponent, NavbarComponent, ScheduleComponent, SpinnerComponent],
  exports: [FooterComponent, NavbarComponent, ScheduleComponent, SpinnerComponent],
})
export class ComponentsModule {}
