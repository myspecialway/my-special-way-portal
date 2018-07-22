import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.graphql.service';
import Student, { Gender } from '../../../models/student.model';
import { ClassService } from '../../class/services/class.graphql.service';
import { Class } from '../../../models/class.model';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {

  student: Student;
  classes: Class[];
  isNewStudent: boolean;

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.populateClasses();
    this.populateStudent();
  }

  async populateStudent() {
    const currentPath = get(this.route, ['snapshot', 'routeConfig', 'path']);
    if (currentPath === 'student/_new_') {
      this.isNewStudent = true;
      this.student = this.createNewStudent();
    } else if (currentPath === 'student/:id') {
      this.isNewStudent = false;
      try {
        this.student = await this.studentService.getById(this.route.params['value'].id);
      } catch (error) {
        // TODO: implement error handling on UI
        throw new Error('Error handling not implemented');
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
