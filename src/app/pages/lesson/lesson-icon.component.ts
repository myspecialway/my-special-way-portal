import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lesson-icon',
  templateUrl: './lesson-icon.component.html',
  styleUrls: ['./lesson-icon.component.scss'],
})
export class LessonIconComponent implements OnInit {
  @Input()
  public icon = '';
  ngOnInit(): void {}
}
