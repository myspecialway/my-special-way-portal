import { IReminder, ISetReminder, ReminderType } from './../../../../../models/reminder.model';
import { REMINDERS_CONSTANTS, IReminderTime } from './../../../../../models/reminder-time.model';
import { getNewReminder, getSetReminder, getDbReminder } from './../reminders.utils';
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
  dialogData = REMINDERS_CONSTANTS;
  hourSelectorEnabled = true;
  hours = new FormControl();
  // hourSelectorEnabled = true;
  reminderType = ReminderType;
  daySelected = true;
  dirty = false;
  hourInput = new FormControl();
  @Output()
  cancel = new EventEmitter<void>();

  options = { submitButtonLabel: 'עדכן' };

  data: ISetReminder;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddStudentReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: IReminder,
  ) {
    this.data = getSetReminder(_data);
  }

  ngOnInit(): void {
    if (this.data.schedule.length === 0) {
      this.addReminder();
    }
    this.form = this.formBuilder.group({});
  }

  /**
   * If a user select multiple reminder and only fill some of them this method clean the unnecessary fields
   * @param data
   */
  private reminderCleanup(data?: ISetReminder) {
    const filteredScheduleContainer: any = [];
    if (data && data.schedule) {
      for (const reminder of data.schedule) {
        if (reminder.daysindex.size && reminder.hours.size) {
          filteredScheduleContainer.push(reminder);
          console.log(reminder.daysindex.size);
        }
      }
      data.schedule = filteredScheduleContainer;
    }
  }

  close(data?: ISetReminder): void {
    this.reminderCleanup(data);
    const retData: IReminder | undefined = data ? getDbReminder(data) : data;
    this._data = retData as IReminder;
    this.dialogRef.close(retData);
  }

  addReminder() {
    this.data.schedule.push(getNewReminder());
  }

  toggleDay(selectedIndex: number, block: IReminderTime) {
    this.dirty = true;
    type Action = 'delete' | 'add';
    const weekDaysIndexes = [0, 1, 2, 3, 4];
    const multiDayIndex = 6;
    let daysIndexes: number[];
    let action: Action = this.isDaySelected(selectedIndex, block) ? 'delete' : 'add';

    if (selectedIndex === multiDayIndex) {
      daysIndexes = [...weekDaysIndexes];
    } else {
      daysIndexes = [selectedIndex];
    }

    daysIndexes.forEach((i) => {
      block.daysindex[action](i);
    });

    // if week day is toggled off - toggle off the multi-day button, too
    const shouldSelectMultiDayIndex = weekDaysIndexes.every((i) => this.isDaySelected(i, block));
    action = shouldSelectMultiDayIndex ? 'add' : 'delete';
    block.daysindex[action](multiDayIndex);
  }

  selectHour(hour: string, block: IReminderTime) {
    if (!hour || block.hours.has(hour)) return;
    block.hours.add(hour);
    block.hours = this.getSortedHours(block.hours);
    this.hourSelectorEnable(false);
  }

  hourSelectorEnable(val = true) {
    this.hourSelectorEnabled = val;
  }

  removeHour(hour: string, block: IReminderTime) {
    block.hours.delete(hour);
    this.hourSelectorEnable(false);
  }

  private isDaySelected(dayIndex: number, block: IReminderTime) {
    this.daySelected = !!block.daysindex.size;
    return block.daysindex.has(dayIndex);
  }

  private getSortedHours(hours: Set<string>) {
    return new Set<string>([...Array.from(hours)].sort());
  }

  deleteReminder(block, i) {
    return this.data.schedule.splice(i, 1);
  }
}
