import { REMINDERS_CONSTANTS, IDbReminderTime } from './../../../../../models/reminder-time.model';
import { StudentService } from './../../../services/student.service';
import { ReminderType, IReminder } from './../../../../../models/reminder.model';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { MatDialog } from '@angular/material';
import { AddStudentReminderDialogComponent } from '../../../dialogs/reminders/add/add-student-reminder.dialog';
import Student from '../../../../../models/student.model';
import to from 'await-to-js';
import * as _ from 'lodash';

@Component({
  selector: 'app-student-details-reminders',
  templateUrl: './student-details-reminders.component.html',
  styleUrls: ['./student-details-reminders.component.scss'],
})
export class StudentDetailsRemindersComponent implements OnInit {
  idOrNew: string;

  student: Student;
  dayNames: string[] = Array.from(REMINDERS_CONSTANTS.days);
  protected reminderType = ReminderType;
  emptyDialogString = 'בחר יום ושעה';

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private studentService: StudentService) {}

  ngOnInit() {
    if (this.route && this.route.parent) {
      this.subCollector.add(
        this.route.parent.params.subscribe(async (params) => {
          // this.idOrNew = params.idOrNew;
          await this.fetchStudent(params.idOrNew);
        }),
      );
    }
  }

  showReminderDialog(reminder: IReminder) {
    const dialogRef = this.dialog.open(AddStudentReminderDialogComponent, {
      data: reminder,
      height: '376px',
      width: '631px',
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (data: IReminder) => {
          await this.updateStudentReminders(data);
        }),
    );
  }

  async updateStudentReminders(data: IReminder) {
    if (!data) return;
    const { class: _class, reminders, ...studentQuery } = this.student;
    const class_id = _class ? _class._id : '';
    const newReminders = reminders.map((_reminder) => {
      if (_reminder.type === data.type) {
        return data;
      }
      return _reminder;
    });

    const [err] = await to<string>(this.studentService.update({ ...studentQuery, reminders: newReminders, class_id }));
    if (!err) {
      await this.fetchStudent(studentQuery._id.toString());
    }
  }

  async fetchStudent(id: string) {
    const [err, student] = await to<Student>(this.studentService.getById(id));
    if (!err) {
      this.student = _.cloneDeep(student as Student);
    }
  }

  getSelectedDays(slot: IDbReminderTime): string {
    if (!slot.daysindex) {
      return '';
    }
    slot.daysindex.sort();
    return slot.daysindex.map((dayIndex) => this.dayNames[dayIndex]).join(',');
  }

  getSelectedHours(slot: IDbReminderTime): string {
    if (!slot.hours) {
      return '';
    }
    slot.hours.sort();
    return slot.hours.join(',');
  }

  toggleActivity(reminder: IReminder) {
    this.updateStudentReminders(reminder);
  }
}
