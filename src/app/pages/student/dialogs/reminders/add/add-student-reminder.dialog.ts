import { REMINDERS_DIALOG_FORM_DATA, IReminderTime } from './../../../../../models/reminder-time.model';
import { getNewReminder } from './../reminders.utils';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-student.dialog',
  templateUrl: './add-student-reminder.dialog.html',
  styleUrls: ['./add-student-reminder.dialog.scss'],
})
export class AddStudentReminderDialogComponent implements OnInit {
  form: FormGroup;
  // formControl = new FormControl('', [Validators.required]);
  dialogData = REMINDERS_DIALOG_FORM_DATA;
  hours = new FormControl();
  hourSelectorEnabled = true;

  @Output()
  cancel = new EventEmitter<void>();

  options = { submitButtonLabel: 'עדכן' };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReminderTime[],
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

  close(data?): void {
    this.dialogRef.close(data);
  }

  addReminder() {
    this.data.push(getNewReminder());
  }

  toggleDay(dayIndex: number, block: IReminderTime) {
    if (this.isDaySelected(dayIndex, block)) {
      block.daysindex.delete(dayIndex);
    } else {
      block.daysindex.add(dayIndex);
    }
    console.log(dayIndex);
  }

  selectHour(hour: string, block: IReminderTime) {
    if (!hour || block.hours.has(hour)) return;
    block.hours.add(hour);
    block.hours = this.getSortedHours(block.hours);
    this.hourSelectorEnable(false);
  }

  hourSelectorEnable(val = true) {
    // if(block.hours.size === 0 ){
    //   return;
    // }
    this.hourSelectorEnabled = val;
  }

  removeHour(hour: string, block: IReminderTime) {
    block.hours.delete(hour);
    this.hourSelectorEnable(false);
  }

  private isDaySelected(dayIndex: number, block: IReminderTime) {
    return block.daysindex.has(dayIndex);
  }

  private getSortedHours(hours: Set<string>) {
    return new Set<string>([...Array.from(hours)].sort());
  }
}
