import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, MatProgressSpinnerModule, HttpClientModule, MatIconModule],
  declarations: [FooterComponent, NavbarComponent, ScheduleComponent, SpinnerComponent],
  exports: [FooterComponent, NavbarComponent, ScheduleComponent, SpinnerComponent],
})
export class ComponentsModule {}
