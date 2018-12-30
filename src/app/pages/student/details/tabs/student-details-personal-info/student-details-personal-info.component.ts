import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import Student, { Gender } from '../../../../../models/student.model';
import { ClassService } from '../../../../class/services/class.graphql.service';
import { Class } from '../../../../../models/class.model';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { Router } from '@angular/router';

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
  maleFaceIcon = 'male_face_enabled';
  femaleFaceIcon = 'female_face_disabled';

  @SubscriptionCleaner()
  subCollector;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private route: ActivatedRoute,
    private router: Router,
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
        this.student = { ...(await this.studentService.getById(this.idOrNew)) };
        if (!this.student.class) {
          this.student.class = new Class();
        }
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
        this.classes = this.classes.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else {
            return 0;
          }
        });
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
      const createdStudent = await this.studentService.create(this.student);
      if (createdStudent && createdStudent.data && createdStudent.data.createStudent) {
        this.changesWereSavedNotification(createdStudent.data.createStudent._id);
      }
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
      this.changesWereSavedNotification(null);
    } catch (error) {
      this.saveFailed = true;
      console.error('Error on update student', error);
    }
  }

  changesWereSavedNotification(createdId) {
    this.changesWereSaved = true;
    setTimeout(() => {
      this.changesWereSaved = false;
      if (createdId) {
        this.router.navigate(['/student/', createdId]);
      }
    }, 1000);
  }

  toggleIconFace() {
    if (this.maleFaceIcon === 'male_face_enabled') {
      this.maleFaceIcon = 'male_face_disabled';
      this.femaleFaceIcon = 'female_face_enabled';
    } else {
      this.maleFaceIcon = 'male_face_enabled';
      this.femaleFaceIcon = 'female_face_disabled';
    }
  }
}
