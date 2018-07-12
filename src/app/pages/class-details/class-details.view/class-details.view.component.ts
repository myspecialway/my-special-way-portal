import { Component, Input } from '@angular/core';
import { Lesson } from '../../../models/lesson.model';

@Component({
  selector: 'app-class-details-view',
  templateUrl: './class-details.view.component.html',
  styleUrls: ['./class-details.view.component.scss'],
})
export class ClassDetailsViewComponent {

  @Input()
  schedule: Lesson[][];
  @Input()
  daysLabels: string[];
  @Input()
  hoursLabels: string[];
}
