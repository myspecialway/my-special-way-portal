import { Selector, t } from 'testcafe';

export default class StudentsPage {
  static url = '/student';
  userName: string;
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
  passwordFormatErr: Selector;
  scheduleTestUserNameCell: Selector;
  scheduleTestUserDeleteButton: Selector;
  confirmDeleteButton: Selector;
  currentRowNumber: string;
  currentColumnNumber: string;
  scheduleEmptyCell: Selector;
  scheduleSlotHeaderDay: Selector;
  scheduleSlotHeaderHour: Selector;
  scheduleSlotHeader: Selector;
  errors: Selector;
  scheduleCellLesson: Selector;
  scheduleLessonList: string[];

  constructor() {
    this.userName = 'אבגדה';
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
    this.usernameFormatErr = Selector('[data-test-id$="username-format-pattern-err"]');
    this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
    this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
    this.classIdErr = Selector('[data-test-id$="class-id-err"]');
    this.passwordErr = Selector('[data-test-id$="password-err"]');
    this.scheduleTestUserNameCell = Selector('.username').withText(this.userName);
    this.scheduleTestUserDeleteButton = Selector('[data-test-id$="delete-user-button-' + this.userName + '"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-user"');
    this.scheduleSlotHeaderDay = Selector('.timeslot-subtitle .timeslot-info:nth-child(1)');
    this.scheduleSlotHeaderHour = Selector('.timeslot-subtitle .timeslot-info:nth-child(2)');
    this.scheduleSlotHeader = Selector('h2.mat-dialog-title');
    this.errors = Selector('[role=alert]');
    this.scheduleCellLesson = Selector('.mat-select-content mat-option .mat-option-text');
    this.scheduleLessonList = new Array();
    this.passwordFormatErr = Selector('[data-test-id$="password-format-err"]');
  }

  /**
   * create new user
   * @returns {Promise<void>}
   */
  async createNewScheduleTestUser() {
    //If the user exists - delete it.
    try {
      if (await this.scheduleTestUserNameCell.visible) {
        await t.hover(this.scheduleTestUserNameCell);
        await t.click(this.scheduleTestUserDeleteButton).click(this.confirmDeleteButton);
        await t.expect(this.scheduleTestUserNameCell.exists).notOk();
      }
    } catch (error) {}

    //Create a new scheduleTestUser
    await t.click(this.newStudentButton);
    await this.firstName();
    await t.typeText(this.username, this.userName);
    await t.typeText(this.password, '12scheduleTestUser');
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

  /**@drieur
   * get total rows number on the student schedule table
   * @returns {Promise<void>}
   */
  async getStudentScheduleTableRowsNumber() {
    try {
      const container = await Selector('tbody');
      // console.log((await container.childElementCount) + '   :number of rows');
      return await container.childElementCount;
    } catch (CantObtainInfoForElementSpecifiedBySelectorError) {
      return 0;
    }
  }

  /**
   * @drieur
   * get cell content value.
   * @param row number
   * @param column number
   * @returns {Promise<void>}
   */
  async getCellDisplayContentOnSchedule(row, column) {
    try {
      const container = await Selector('tbody tr:nth-child(' + row + ') td:nth-child(' + column + ')');
      return await container.innerText;
    } catch (CantObtainInfoForElementSpecifiedBySelectorError) {
      return '0';
    }
  }

  /**
   * @drieur
   * get cell DayValue on the schedule table
   * * @param coloumn
   * @returns {Promise<void>}
   */
  async getScheduleTableDayValue(coloumn) {
    coloumn--;
    return await Selector('.mat-table .mat-header-row  .mat-header-cell:nth-child(' + coloumn + ')').innerText;
  }

  /**
   * @drieur
   * get cell DayValue on the selected opened scheduled slot
   * @returns {Promise<void>}
   */
  async getSelectedSlotDayValue() {
    try {
      return await this.scheduleSlotHeaderDay.innerText;
    } catch (CantObtainInfoForElementSpecifiedBySelectorError) {
      return '0';
    }
  }

  /**
   * @drieur
   * get cell title value on the selected opened scheduled slot
   * @returns {Promise<void>}
   */
  async getScheduleSlotHeader() {
    try {
      return await this.scheduleSlotHeader.innerText;
    } catch (CantObtainInfoForElementSpecifiedBySelectorError) {
      return '0';
    }
  }

  /**
   * @drieur
   * get cell header on the selected opened scheduled slot
   * @returns {Promise<void>}
   */
  async getSelectedSlotHeader() {
    return await this.scheduleSlotHeader.innerText;
  }

  /**
   * @drieur
   * get hour value on the schedule table
   * @param row
   * @returns {Promise<void>}
   */
  async getScheduleTableHourValue(row) {
    return await Selector('.mat-table .mat-row:nth-child(' + row + ')  .mat-cell:nth-child(2)').innerText;
  }

  /**
   * @drieur
   * get cellHourValue
   * @returns {Promise<void>}
   */
  async getSelectedSlotHour() {
    return await this.scheduleSlotHeaderHour.innerText;
  }

  /**
   * @drieur
   * assign to currentRowNumber and currentCOlNumber the value of the empty cell
   * @param totalRowNumber
   * @returns {Promise<void>}
   */
  async findEmptyCell(totalRowNumber) {
    let rowContent = 'initial';
    let row = 1;
    let isEmpty = false;

    for (; row <= totalRowNumber; row++) {
      let col = 3;

      for (; col <= 6; col++) {
        rowContent = await this.getCellDisplayContentOnSchedule(row, col);
        if (rowContent.includes('add') && isEmpty === false) {
          this.currentColumnNumber = col.toString();
          this.currentRowNumber = row.toString();
          isEmpty = true;
        }
      }
    }
    this.scheduleEmptyCell = Selector(
      'tbody tr:nth-child(' + this.currentRowNumber + ' ) td:nth-child(' + this.currentColumnNumber + ')',
    );
  }

  async findLesson(row) {
    const value = await this.scheduleCellLesson.nth(row).textContent;
    return value.includes(row);
  }
}
