import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson/lesson.graphql.service';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { first } from 'rxjs/operators';
import { DeleteLessonDialogComponent } from './dialogs/delete/delete-lesson.dialog';
import { Subscription } from 'rxjs';
import { ClassService } from '../class/services/class.graphql.service';
import { Class } from '../../models/class.model';
import { CantDeleteLessonDialogComponent } from './dialogs/cant-delete/cant-delete-lesson.dialog';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  displayedColumns = ['title', 'icon', 'deleteLesson'];
  dataSource = new MatTableDataSource<Lesson>();

  @ViewChild(MatSort)
  sort: MatSort;

  @SubscriptionCleaner()
  subCollector: Subscription;
  constructor(private lessonService: LessonService, private classService: ClassService, public dialog: MatDialog) {}
  async ngOnInit() {
    try {
      this.subCollector.add(
        this.lessonService.getAllLessons().subscribe((lessons) => {
          this.dataSource.data = [...lessons];
        }),
      );
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  addNewLesson() {
    //this.lessonService.create("a","art");
  }

  public async deleteLesson(_id: string, title: string) {
    const dialogRef = this.dialog.open(DeleteLessonDialogComponent, {
      data: { _id, title },
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result === true) {
            const getAllClassesSub = this.classService
              .getAllClasses()
              .map((classes: Class[]) => this.filterClassesWithLesson(classes, title))
              .subscribe((classesWithLessonTitle) => {
                if (classesWithLessonTitle.length === 0) {
                  this.lessonService.delete(_id);
                } else {
                  this.dialog.open(CantDeleteLessonDialogComponent, {
                    data: { title, className: classesWithLessonTitle[0].name },
                  });
                }
              });
            this.subCollector.add(getAllClassesSub);
          }
        }),
    );
  }
  private filterClassesWithLesson(classes: Class[], lessonTitle: string): Class[] {
    return classes.filter(
      (cls: Class) =>
        cls.schedule.filter((schedule) => schedule.lesson && schedule.lesson.title === lessonTitle).length > 0,
    );
  }
}
