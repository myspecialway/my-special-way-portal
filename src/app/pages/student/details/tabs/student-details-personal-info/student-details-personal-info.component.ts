import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import Student, { Gender } from '../../../../../models/student.model';
import { ClassService } from '../../../../class/services/class.graphql.service';
import { Class } from '../../../../../models/class.model';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';

@Component({
  selector: 'app-student-details-personal-info',
  templateUrl: './student-details-personal-info.component.html',
  styleUrls: ['./student-details-personal-info.component.scss'],
})
export class StudentDetailsPersonalInfoComponent implements OnInit {
  student: Student;
  classes: Class[];
  isNewStudent: boolean;
  idOrNew: string;
  changesWereSaved = false;
  saveFailed = false;

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.route && this.route.parent) {
      this.subCollector.add(
        this.route.parent.params.subscribe((params) => {
          this.idOrNew = params.idOrNew;
        }),
      );
    }

    this.populateClasses();
    this.populateStudent();
  }

  async populateStudent() {
    if (this.idOrNew === '_new_') {
      this.isNewStudent = true;
      this.student = this.createNewStudent();
    } else {
      this.isNewStudent = false;
      try {
        this.student = await this.studentService.getById(this.idOrNew);
      } catch (error) {
        // TODO: implement error handling on UI
        console.error('Error handling not implemented');
        throw error;
      }
    }
  }

  createNewStudent(): Student {
    const student: Student = new Student();
    student.firstname = '';
    student.lastname = '';
    student.username = '';
    student.password = '';
    student.gender = Gender.MALE;
    student.class = new Class();
    return student;
  }

  async populateClasses() {
    try {
      this.classService.getAllClasses().subscribe((classes) => {
        this.classes = [...classes];
      });
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  async addStudent() {
    try {
      this.saveFailed = false;
      await this.studentService.create(this.student);
      this.changesWereSavedNotification();
    } catch (error) {
      this.saveFailed = true;
      console.error('Error on add student', error);
    }
  }

  async updateStudent(student) {
    student.form.value._id = this.student._id;
    try {
      this.saveFailed = false;
      await this.studentService.update(student.form.value);
      this.changesWereSavedNotification();
    } catch (error) {
      this.saveFailed = true;
      console.error('Error on update student', error);
    }
  }

  changesWereSavedNotification() {
    this.changesWereSaved = true;
    setTimeout(() => {
      this.changesWereSaved = false;
    }, 1000);
  }
}
