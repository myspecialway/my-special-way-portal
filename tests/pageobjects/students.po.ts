import { Selector } from 'testcafe';

export default class StudentsPage {
  static url = '/student';
  _id: Selector;
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
  editCellLesson: Selector;
  editCellLocation: Selector;
  lessonOption: Selector;
  locationOption: Selector;
  editCellUpdateButton: Selector;
  editCellCloseButton: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="students-page"]');
    this.newStudentButton = Selector('[data-test-id$="new-student-button"]');
    this.personalDetailsTab = Selector('[data-test-id$="personal-info-tab"]');
    this.scheduleTab = Selector('[data-test-id$="schedule-tab"]');
    this.remindersTab = Selector('[data-test-id$="reminders-tab"]');
    this.saveButton = Selector('[data-test-id$="save-button"]');
    this.username = Selector('[name$="username"]');
    this.firstName = Selector('[name$="firstname"]');
    this.lastName = Selector('[name$="lastname"]');
    this.classId = Selector('[name$="class_id"]');
    this.classIdFirstChoice = Selector('[class="mat-option-text"]').withExactText('טיטאן');
    this.password = Selector('[name$="password"]');
    this.usernameErr = Selector('[data-test-id$="username-err"]');
    this.usernameFormatErr = Selector('[data-test-id$="username-format-err"]');
    this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
    this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
    this.classIdErr = Selector('[data-test-id$="class-id-err"]');
    this.passwordErr = Selector('[data-test-id$="password-err"]');
    this.scheduleTestUserNameCell = Selector('.username').withExactText('scheduleTestUser');
    this.scheduleTestUserDeleteButton = Selector('[data-test-id$="username-delete-button-scheduleTestUser"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-user"');
    this.scheduleCell = Selector('[data-test-id$="studentSchedule-col-1-row-0"]'); //TODO MAAYAN change this
    this.editCellDialogue = Selector('[data-test-id$="edit-cell-dialogue"]');
    this.editCellLesson = Selector('[data-test-id$="lessons-dropDown"]');
    this.editCellLocation = Selector('[data-test-id$="locations-dropDown"]');
    this.lessonOption = Selector('[data-test-id$="lesson-type"]');
    this.locationOption = Selector('[data-test-id$="lesson-location"]');
    this.editCellUpdateButton = Selector('[data-test-id$="update-edit-lesson-dialogue"]');
    this.editCellCloseButton = Selector('[data-test-id$="close-edit-lesson-dialogue"]');
  }
}
