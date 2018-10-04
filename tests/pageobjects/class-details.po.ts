import { Selector } from 'testcafe';

export default class ClassDetailsPage {
  _id: Selector;
  classNameInput: Selector;
  gradeSelect: Selector;
  gradeSelectOption: Selector;
  backToClassButton: Selector;
  classRow: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="class-details-page"]');
    this.classNameInput = Selector('[data-test-id$="class-name-input"]');
    this.gradeSelect = Selector('[data-test-id$="grade-select"]');
    this.gradeSelectOption = Selector('.grade-select-option');
    this.backToClassButton = Selector('.back');
    this.classRow = Selector('.mat-row');
  }
}
