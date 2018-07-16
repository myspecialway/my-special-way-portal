import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.graphql.service';
import Student, {Gender} from '../../../models/student.model';
import {ClassService} from '../../class/services/class.graphql.service';
import {Class} from '../../../models/class.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
})
export class StudentDetailsComponent implements OnInit {

  student: Student;
  classes: Class[];

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.populateClasses();
    this.student = this.createNewStudent();
  }

  createNewStudent(): Student {
    const student: Student = new Student();
    student.firstname = '';
    student.lastname = '';
    student.username = '';
    student.password = '';
    student.gender = Gender.FEMALE;
    student.class_id = 0;
    return student;
  }

  populateClasses() {
    this.classService.getAllClasses().then((classes) => {
      this.classes = classes.data['classes'];
      console.log(this.classes);
    }, (err) => {
      console.log('Failed to get all the classes !!!', err);
    });
  }

  addStudent() {
    console.log('student: ' + this.student);
    this.studentService.create(this.student)
      .then((newStudent) => {
        console.log('Student created: ', newStudent);
        this.router.navigate(['/student']);
      },  (err) => {
        console.log('Failed to add the student !!!', err);
      });
  }
}
