import { Selector } from 'testcafe';

export default class StudentPage {
  newStudentButton: Selector;
  personalDetailsTab: Selector;
  scheduleTab: Selector;
  remindersTab: Selector;
  saveButton: Selector;
  firstName: Selector;
  lastName: Selector;
  username: Selector;
  classId: Selector;
  classIdFirstChoice: Selector;
  password: Selector;
  firstNameErr: Selector;
  lastNameErr: Selector;
  usernameErr: Selector;
  usernameFormatErr: Selector;
  classIdErr: Selector;
  passwordErr: Selector;
  scheduleTestUserNameCell: Selector;
  scheduleTestUserDeleteButton: Selector;
  confirmDeleteButton: Selector;
  scheduleCell: Selector;
  editCellDialogue: Selector;
  constructor() {
    this.newStudentButton = Selector('[data-test-id$="new-student-button"]');
    this.personalDetailsTab = Selector('[data-test-id$="personal-info-tab"]');
    this.scheduleTab = Selector('[data-test-id$="schedule-tab"]');
    this.remindersTab = Selector('[data-test-id$="reminders-tab"]');
    this.saveButton = Selector('[data-test-id$="save-button"]');
    this.username = Selector('[name$="username"]');
    this.firstName = Selector('[name$="firstname"]');
    this.lastName = Selector('[name$="lastname"]');
    this.classId = Selector('[name$="class_id"]');
    this.classIdFirstChoice = Selector('[id$="mat-option-0"]');
    this.password = Selector('[name$="password"]');
    this.usernameErr = Selector('[id$="username-err"]');
    this.usernameFormatErr = Selector('[id$="username-format-err"]');
    this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
    this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
    this.classIdErr = Selector('[data-test-id$="class-id-err"]');
    this.passwordErr = Selector('[data-test-id$="password-err"]');
    this.scheduleTestUserNameCell = Selector('[data-test-id$="username-cell-scheduleTestUser"]');
    this.scheduleTestUserDeleteButton = Selector('[data-test-id$="username-delete-button-scheduleTestUser"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-user"');
    this.scheduleCell = Selector('[id$="studentSchedule-col-1-row-0"]');
    this.editCellDialogue = Selector('[id$="mat-dialog-1"]');
  }
}
