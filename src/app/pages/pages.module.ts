import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDetailsViewComponent } from './class-details/class-details.view/class-details.view.component';
import { ClassDetailsContainerComponent } from './class-details/class-details.container/class-details.container.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
  ],
  declarations: [
    ClassDetailsViewComponent,
    ClassDetailsContainerComponent,
  ],
})
export class PagesModule { }
