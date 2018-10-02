import { Selector, t } from 'testcafe';

export default class ClassesPage {
  static url = '/class';
  _id: Selector;
  scheduleTestClassNameCell: Selector;
  scheduleTestClassDeleteButton: Selector;
  confirmDeleteButton: Selector;
  newClassButton: Selector;
  className: Selector;
  classGradeDropDown: Selector;
  classGradeFirstOption: Selector;
  allClassesButton: Selector;
  scheduleCell: Selector;
  editCellDialogue: Selector;
  editCellLesson: Selector;
  lessonOption: Selector;
  editCellLocation: Selector;
  locationOption: Selector;
  editCellUpdateButton: Selector;
  editCellCloseButton: Selector;

  constructor() {
    this._id = Selector('[data-test-id$="classes-page"]');
    this.scheduleTestClassNameCell = Selector('.class-name').withExactText('scheduleTestClass');
    this.scheduleTestClassDeleteButton = Selector('[data-test-id$="delete-class-button-scheduleTestClass"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-class"]');
    this.newClassButton = Selector('.mat-button-wrapper').withExactText('הוספת כיתה חדשה');
    this.className = Selector('[id$="class-name"]');
    this.classGradeDropDown = Selector('[id$="class-grade"]');
    this.classGradeFirstOption = Selector('.mat-option-text').withExactText('א');
    this.allClassesButton = Selector('.back');
    this.scheduleCell = Selector('[role$="gridcell"]').nth(10);
    this.editCellDialogue = Selector('[data-test-id$="edit-cell-dialogue"]');
    this.editCellLesson = Selector('[data-test-id$="lessons-dropdown"]');
    this.lessonOption = Selector('.lessons-option');
    this.editCellLocation = Selector('[data-test-id$="locations-dropdown"]');
    this.locationOption = Selector('.locations-option');
    this.editCellUpdateButton = Selector('[data-test-id$="update-edit-lesson-dialogue"]');
    this.editCellCloseButton = Selector('[data-test-id$="close-edit-lesson-dialogue"]');
  }

  async createNewScheduleTestClass() {
    //TODO - uncomment before merging!!!!!!!!!!!
    //If the class exists - delete it.
    /*if (await this.scheduleTestClassNameCell.exists) {
      await t.click(this.scheduleTestClassDeleteButton).click(this.confirmDeleteButton);
    }
    //If the class still exists - fail the test

    //await t.expect(this.scheduleTestClassNameCell.exists).notOk();

    //Create a new scheduleTestClass
    await t.click(this.newClassButton);
    await t.typeText(this.className, 'scheduleTestClass');
    await t.click(this.classGradeDropDown);
    await t.click(this.classGradeFirstOption);

    //Leave the class details page and verify that the class is created
    await t.click(this.allClassesButton);
    await t.expect(this.scheduleTestClassNameCell.exists).ok();*/
    await t.click(this.scheduleTestClassNameCell);
  }

  async createNewScheduleCell() {
    await t.expect(this.scheduleCell.textContent).contains('add');
    await t.click(this.scheduleCell);
    await t.click(this.editCellLesson);
    await t.click(this.lessonOption);
    await t.click(this.editCellLocation);
    await t.click(this.locationOption);
  }
}
