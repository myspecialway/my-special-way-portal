import {MatTableDataSource, MatSort } from '@angular/material';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson/lesson.graphql.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, AfterViewInit {

  displayedColumns = ['title', 'icon', 'deleteLesson'];
  dataSource = new MatTableDataSource<Lesson>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private lessonService: LessonService,

  ) { }

  ngAfterViewInit(): void {
  //  throw new Error("Method not implemented.");
  }

  async ngOnInit() {
     const lessons = await this.lessonService.getLessons();
     this.dataSource.data = [...lessons];
  }

  addNewLesson() {
  }

  deleteLesson(_id: number) {

  }
}
