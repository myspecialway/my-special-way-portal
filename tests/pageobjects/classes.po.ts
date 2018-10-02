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
  }

  async createNewScheduleTestClass() {
    //If the class exists - delete it.
    if (await this.scheduleTestClassNameCell.exists) {
      await t.click(this.scheduleTestClassDeleteButton).click(this.confirmDeleteButton);
    }
    //If the class still exists - fail the test
    //TODO - uncomment before merging!!!!!!!!!!!
    //await t.expect(this.scheduleTestClassNameCell.exists).notOk();

    //Create a new scheduleTestClass
    await t.click(this.newClassButton);
    await t.typeText(this.className, 'scheduleTestClass');
    await t.click(this.classGradeDropDown);
    await t.click(this.classGradeFirstOption);

    //Leave the class details page and verify that the class is created
    await t.click(this.allClassesButton);
    await t.expect(this.scheduleTestClassNameCell.exists).ok();
    await t.click(this.scheduleTestClassNameCell);
  }
}
