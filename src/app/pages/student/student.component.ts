import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import { StudentService } from './services/student.service';
import Student from '../../models/student.model';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Apollo } from 'apollo-angular';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserType } from '../../models/user.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  displayedColumns = ['studentName', 'gradeId', 'username', 'deleteUser'];
  dataSource = new MatTableDataSource<Student>();
  mayAddStudent = false;
  mayDeleteStudent = false;

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(private studentService: StudentService, private dialog: MatDialog, private apollo: Apollo) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.subCollector.add(
      this.studentService.getAllStudents().subscribe((data) => {
        this.dataSource.data = [...data];
      }),
    );

    this.dataSource.sortingDataAccessor = (item) => item.firstname + item.lastname;

    // todo: create a currentUser / permissions service / directive to handle permissions.
    this.apollo
      .watchQuery<{ userProfile: UserProfileStateModel }>({
        query: GET_USER_PROFILE,
      })
      .valueChanges.subscribe((userProf) => {
        const currentType = userProf.data.userProfile.role;
        this.mayAddStudent = UserType[currentType] === UserType.PRINCIPLE;
        this.mayDeleteStudent = UserType[currentType] === UserType.PRINCIPLE;
      });
  }

  async deleteStudent(id: number, firstName: string, lastName: string, gradeId: string, gender: string) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      data: { id, firstName, lastName, gradeId, gender },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (deletionConfirmed) => {
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
      });
  }
}
