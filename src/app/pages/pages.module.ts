import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsViewComponent } from './class-details/class-details.view/class-details.view.component';
import { ClassDetailsContainerComponent } from './class-details/class-details.container/class-details.container.component';
import { ComponentsModule } from '../components/components.module';
import { RouterModule } from '@angular/router';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
  ],
  declarations: [
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
  ],
})
export class PagesModule { }
