import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.graphql.service';
import Student, {Gender} from '../../../models/student.model';
import {ClassService} from '../../class/services/class.graphql.service';
import {Class} from '../../../models/class.model';
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

  populateStudent() {
    const currentPath = get(this.route, ['snapshot', 'routeConfig', 'path']);
    if (currentPath === 'student/new') {
      this.isNewStudent = true;
      this.student = this.createNewStudent();
    } else if (currentPath === 'student/:id') {
      this.isNewStudent = false;
      this.studentService.getById(this.route.params['value'].id).then((student) => {
        this.student = student.data['student'];
      });
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

  populateClasses() {
    this.classService.getAllClasses().then((classes) => {
      this.classes = classes.data['classes'];
    });
  }

  addStudent() {
    this.studentService.create(this.student)
      .then((newStudent) => {
        this.router.navigate(['/student']);
      });
  }

  updateStudent(student) {
    student.form.value._id = this.student._id;
    this.studentService.update(student.form.value)
      .then((updatedStudent) => {
        this.router.navigate(['/student']);
      });
  }

}
