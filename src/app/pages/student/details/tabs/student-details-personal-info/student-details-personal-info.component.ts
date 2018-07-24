import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../services/student.graphql.service';
import Student, { Gender } from '../../../../../models/student.model';
import { ClassService } from '../../../../class/services/class.graphql.service';
import { Class } from '../../../../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.route && this.route.parent) {
      this.route.parent.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
      });
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
    student.gender = Gender.FEMALE;
    student.class = {
      _id: '0',
      name: '',
      level: '',
      number: 0,
    };
    return student;
  }

  async populateClasses() {
    try {
      this.classes = await this.classService.getAllClasses();
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  async addStudent() {
    try {
      await this.studentService.create(this.student);
      this.router.navigate(['/student']);
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }

  async updateStudent(student) {
    student.form.value._id = this.student._id;
    try {
      await this.studentService.update(student.form.value);
      this.router.navigate(['/student']);
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }
}
