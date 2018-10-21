import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import { StudentService } from './services/student.service';
import Student from '../../models/student.model';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  displayedColumns = ['studentName', 'gradeId', 'username', 'deleteUser'];
  dataSource = new MatTableDataSource<Student>();

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(private studentService: StudentService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.dataSource.sort = this.sort;
    this.subCollector.add(
      this.studentService.getAllStudents().subscribe((data) => {
        this.dataSource.data = [...data];
      }),
    );
  }

  async deleteStudent(id: number, firstName: string, lastName: string, gradeId: string, gender: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: { id, firstName, lastName, gradeId, gender },
    });

    this.subCollector.add(
      dialogRef.afterClosed().subscribe(async (deletionConfirmed) => {
        if (!deletionConfirmed) {
          return;
        }

        try {
          await this.studentService.delete(id);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      }),
    );
  }
}
