import { Selector, t } from 'testcafe';

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
  classIdFirstOption: Selector;
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
    this.classIdFirstOption = Selector('[class="mat-option-text"]').withExactText('טיטאן');
    this.password = Selector('[name$="password"]');
    this.usernameErr = Selector('[data-test-id$="username-err"]');
    this.usernameFormatErr = Selector('[data-test-id$="username-format-err"]');
    this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
    this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
    this.classIdErr = Selector('[data-test-id$="class-id-err"]');
    this.passwordErr = Selector('[data-test-id$="password-err"]');
    this.scheduleTestUserNameCell = Selector('.username').withExactText('scheduleTestUser');
    this.scheduleTestUserDeleteButton = Selector('[data-test-id$="delete-user-button-scheduleTestUser"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-user"');
  }

  async createNewScheduleTestUser() {
    //If the user exists - delete it.
    if (await this.scheduleTestUserNameCell.exists) {
      await t.click(this.scheduleTestUserDeleteButton).click(this.confirmDeleteButton);
    }
    //If the user still exists - fail the test
    await t.expect(this.scheduleTestUserNameCell.exists).notOk();
    //Create a new scheduleTestUser
    await t.click(this.newStudentButton);
    await this.firstName();
    await t.typeText(this.username, 'אאאאאא');
    await t.typeText(this.password, 'scheduleTestUser');
    await t.typeText(this.firstName, 'scheduleTestUser');
    await t.typeText(this.lastName, 'scheduleTestUser');
    await t.click(this.classId);
    await t.click(this.classIdFirstOption);
    await t.click(this.saveButton);

    //user should now exist
    await t.expect(this.scheduleTestUserNameCell.exists).ok();
  }

  async navigateToScheduleTab() {
    await t.click(this.scheduleTestUserNameCell);
    await t.click(this.scheduleTab);
  }
}
