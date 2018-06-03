import {Component, Inject, OnInit} from '@angular/core';
import Student from '../../../../models/Student';
import {StudentService} from '../../services/studnet.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {ClassService} from '../../../class/services/class.service';
import Class from '../../../../models/Class';

@Component({
  selector: 'app-add-student.dialog',
  templateUrl: './add-student.dialog.html',
  styleUrls: ['./add-student.dialog.scss']
})

export class AddStudentDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddStudentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Student,
              public studentService: StudentService,
              public classService: ClassService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  gradeList: Class[];

  ngOnInit(): void {
    this.classService.getAllClasses();
    // this.gradeList = this.classService.data;
    // const ddd = false;
  }

    getErrorMessage() {
      return this.formControl.hasError('required') ? 'Required field' :
        this.formControl.hasError('email') ? 'Not a valid email' :
          '';
    }

    close(): void {
      this.dialogRef.close();
    }

  confirmAdd(): void {
    this.studentService.addStudent(this.data);
  }
}
