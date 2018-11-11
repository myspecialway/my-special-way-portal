import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-icon',
  templateUrl: './lesson-icon.component.html',
  styleUrls: ['./lesson-icon.component.scss'],
})
export class LessonIconComponent implements OnInit {
  private icon = 'english';
  ngOnInit(): void {}
}
