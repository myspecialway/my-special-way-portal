import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lesson-icon',
  templateUrl: './lesson-icon.component.html',
  styleUrls: ['./lesson-icon.component.scss'],
})
export class LessonIconComponent {
  @Input()
  public icon = '';
  @Input()
  public data: { icon: string };
}
