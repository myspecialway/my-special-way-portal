import { Component, Inject, OnInit } from '@angular/core';
import Student from '../../../../models/student.model';
import { StudentService } from '../../services/student.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Class } from '../../../../models/class.model';

@Component({
  selector: 'app-add-student.dialog',
  templateUrl: './add-student.dialog.html',
  styleUrls: ['./add-student.dialog.scss'],
})
export class AddStudentDialogComponent implements OnInit {
  form: FormGroup;
  formControl = new FormControl('', [Validators.required]);
  gradeList: Class[];
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student,
    public studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: '',
      lastName: '',
      gender: '',
      userName: '',
      password: '',
      class: undefined,
    });
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmAdd(dialogData): void {
    this.dialogRef.close(dialogData);
  }
}
