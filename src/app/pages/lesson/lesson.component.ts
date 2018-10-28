import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson/lesson.graphql.service';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { first } from 'rxjs/operators';
import { DeleteLessonDialogComponent } from './dialogs/delete/delete-lesson.dialog';
import { Subscription } from 'rxjs';
import { ClassService } from '../class/services/class.graphql.service';

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

  addNewLesson() {}

  public async deleteLesson(_id: string, title: string = 'מולדת') {
    const dialogRef = this.dialog.open(DeleteLessonDialogComponent, {
      data: { _id, name, level: null },
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result === true) {
            this.classService.classByLessonTitle(title).subscribe((classes) => {
              if ((classes.data as any).classByLessonTitle.length === 0) {
                this.lessonService.delete(_id);
              } else {
                alert('cant delete - used');
              }

              console.log(classes);
            });
          }
        }),
    );
  }
}
