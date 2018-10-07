import { Selector, t } from 'testcafe';

export default class ClassesPage {
  static url = '/class';
  _id: Selector;
  classNameCell: Selector;
  addClassButton: Selector;
  deleteClassDialogDeleteButton: Selector;

  constructor() {
    this._id = Selector('[data-test-id$="classes-page"]');
    this.classNameCell = Selector('.mat-row a');
    this.addClassButton = Selector('[data-test-id="add-class-button"]');
    this.deleteClassDialogDeleteButton = Selector('[data-test-id="delete-button"]');
  }

  static getDeleteClassButtonSelector(className: string): Selector {
    return Selector(`[data-test-id=delete-class-button-${className}]`);
  }

  async deleteClass(className: string) {
    await t.click(ClassesPage.getDeleteClassButtonSelector(className)).click(this.deleteClassDialogDeleteButton);
  }
}
