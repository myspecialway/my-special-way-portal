import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson/lesson.graphql.service';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { first } from 'rxjs/operators';
import { DeleteClassDialogComponent } from '../class/dialogs/delete/delete-class.dialog';

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
  subCollector;
  constructor(private lessonService: LessonService, public dialog: MatDialog) {}

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

  public async deleteLesson(_id: string) {
    const dialogRef = this.dialog.open(DeleteClassDialogComponent, {
      data: { _id, name, level: null },
    });
    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result === true) {
            await this.lessonService.delete(_id);
          }
        }),
    );
  }
}
