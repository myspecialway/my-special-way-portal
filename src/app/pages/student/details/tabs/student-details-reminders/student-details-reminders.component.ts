import { StudentService } from './../../../services/student.service';
import { ReminderType, IReminder } from './../../../../../models/reminder.model';
import { getNewReminder, getSetReminder } from './../../../dialogs/reminders/reminders.utils';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../../../decorators/SubscriptionCleaner.decorator';
import { MatDialog } from '@angular/material';
import { AddStudentReminderDialogComponent } from '../../../dialogs/reminders/add/add-student-reminder.dialog';
import Student from '../../../../../models/student.model';

@Component({
  selector: 'app-student-details-reminders',
  templateUrl: './student-details-reminders.component.html',
  styleUrls: ['./student-details-reminders.component.scss'],
})
export class StudentDetailsRemindersComponent implements OnInit {
  idOrNew: string;

  // get reminderTypes() {
  //   const keys = Object.keys(ReminderType);
  //   return keys.map((el) => [el, Object(ReminderType)[el]]);
  // }
  // get reminderTypeNames() {
  //   return this.reminderTypes.map((type) => ReminderType[type]);
  // }
  rehabToggleMode = false;
  medicineToggleMode = false;
  student: Student;
  protected reminderType = ReminderType;

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

  updateStudentReminder(reminder: IReminder) {
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
          const { class: _class, reminders, ...studentQuery } = this.student;
          const class_id = _class ? _class._id : '';
          const newReminders = reminders.map((_reminder) => {
            if (_reminder.type === data.type) {
              return data;
            }
            return _reminder;
          });

          await this.studentService.update({ ...studentQuery, reminders: newReminders, class_id });
        }),
    );
  }

  async fetchStudent(id) {
    this.student = await this.studentService.getById(id);
  }
}
