import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { DeleteStudentDialogComponent } from './dialogs/delete/delete-student.dialog';
import { StudentService } from './services/student.service';
import Student from '../../models/student.model';
import { SubscriptionCleaner } from '../../decorators/SubscriptionCleaner.decorator';
import { Apollo } from 'apollo-angular';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';
import { GET_USER_PROFILE } from '../../apollo/state/queries/get-user-profile.query';
import { UserType } from '../../models/user.model';
import { FormControl } from '@angular/forms';
import { Class } from '../../models/class.model';
import { MSWSnackbar } from '../../services/msw-snackbar/msw-snackbar.service';
import { ErrorDialogComponent, ErrorDetails } from '../common/error-dialog/error.dialog';
import { FileImportStudentService } from '../../file-import/students-file-import/students-file-import.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  displayedColumns = ['studentName', 'gradeId', 'username', 'deleteUser'];
  dataSource = new MatTableDataSource<Student>();
  classes: Class[];
  fileInput: string;
  mayAddStudent = false;
  mayDeleteStudent = false;
  showStudentNameFilter = false;
  showGradeIdFilter = false;
  showNoRecords = false;
  studentNameFilter = new FormControl('');
  gradeIdFilter = new FormControl('');
  filterValues = {
    studentName: '',
    gradeId: '',
  };

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild('table')
  table: ElementRef;
  @ViewChild('studentNameField')
  studentNameField: ElementRef;
  @ViewChild('gradeIdField')
  gradeIdField: ElementRef;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private ref: ChangeDetectorRef,
    private studentService: StudentService,
    private fileImportStudentService: FileImportStudentService,
    private snackbar: MSWSnackbar,
    private dialog: MatDialog,
    private apollo: Apollo,
  ) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.tableFilter();

    this.subCollector.add(
      this.studentService.getAllStudents().subscribe((data) => {
        this.dataSource.data = [...data];
        this.dealNoDataCase();
      }),
    );

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'studentName':
          return item.firstname + item.lastname;
        case 'gradeId':
          return item.class.name;
        default:
          return item[property];
      }
    };

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

    this.studentNameFilter.valueChanges.subscribe((studentName) => {
      this.filterValues.studentName = studentName.trim().toLowerCase();
      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.dealNoDataCase();
    });

    this.gradeIdFilter.valueChanges.subscribe((gradeId) => {
      this.filterValues.gradeId = gradeId.trim().toLowerCase();
      this.dataSource.filter = JSON.stringify(this.filterValues);
      this.dealNoDataCase();
    });
  }

  private dealNoDataCase() {
    this.showNoRecords = this.dataSource.data.length === 0 || this.dataSource.filteredData.length === 0;
  }

  tableFilter(): (data: any, filter: string) => boolean {
    const filterFunction = (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      const studentName = `${data.firstname} ${data.lastname}`.toLowerCase();
      const gradeId = `${(data.class && data.class.name) || ''}`.toLowerCase();
      return studentName.indexOf(searchTerms.studentName) !== -1 && gradeId.indexOf(searchTerms.gradeId) !== -1;
    };
    return filterFunction;
  }

  toggleStudentNameFilter() {
    const isEmpty = !this.studentNameFilter.value.trim();
    if (isEmpty) {
      this.showStudentNameFilter = !this.showStudentNameFilter;
    }
    if (this.showStudentNameFilter && isEmpty) {
      this.ref.detectChanges();
      this.studentNameField.nativeElement.focus();
    }
  }

  toggleGradeIdFilter() {
    const isEmpty = !this.gradeIdFilter.value.trim();
    if (isEmpty) {
      this.showGradeIdFilter = !this.showGradeIdFilter;
    }
    if (this.showGradeIdFilter && isEmpty) {
      this.ref.detectChanges();
      this.gradeIdField.nativeElement.focus();
    }
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

  async onFileChange(event) {
    const files = event.target.files || event.srcElement.files;
    this.fileInput = '';
    if (!files || files.length === 0) return;
    try {
      const [studentsFileErrors, students] = await this.fileImportStudentService.getStudents(files[0]);
      if (!studentsFileErrors) {
        await this.studentService.createMany(students);
        this.snackbar.displayTimedMessage('קובץ נטען בהצלחה');
      } else {
        const errorDetails = this.studentService.buildErrorMessage(studentsFileErrors);
        this.dialog.open(ErrorDialogComponent, {
          data: errorDetails,
        });
      }
    } catch (error) {
      const errorDetails: ErrorDetails = {
        title: 'שגיאה בטעינת הקובץ',
        details: [error.message],
        bottomline: 'אנא נסה שנית.',
      };
      this.dialog.open(ErrorDialogComponent, {
        data: errorDetails,
      });
    }
  }
}
