import { Selector } from 'testcafe';

export default class ClassDetailsPage {
  _id: Selector;
  classNameInput: Selector;
  gradeSelect: Selector;
  gradeSelectOption: Selector;
  backToClassButton: Selector;
  classRow: Selector;
  scheduleCell: Selector;
  scheduleEmptyCell: Selector;
  editCellDialogue: Selector;
  editCellLesson: Selector;
  editCellLocation: Selector;
  lessonOption: Selector;
  locationOption: Selector;
  editCellUpdateButton: Selector;
  editCellCloseButton: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="class-details-page"]');
    this.classNameInput = Selector('[data-test-id$="class-name-input"]');
    this.gradeSelect = Selector('[data-test-id$="grade-select"]');
    this.gradeSelectOption = Selector('.grade-select-option');
    this.backToClassButton = Selector('.back');
    this.classRow = Selector('.mat-row');
    this.scheduleCell = Selector('[role$="gridcell"]');
    this.scheduleEmptyCell = this.scheduleCell.nth(10);
    this.editCellDialogue = Selector('[data-test-id$="edit-cell-dialogue"]');
    this.editCellLesson = Selector('[data-test-id$="lessons-dropdown"]');
    this.editCellLocation = Selector('[data-test-id$="locations-dropdown"]');
    this.lessonOption = Selector('.lessons-option');
    this.locationOption = Selector('.locations-option');
    this.editCellUpdateButton = Selector('[data-test-id$="update-edit-lesson-dialogue"]');
    this.editCellCloseButton = Selector('[data-test-id$="close-edit-lesson-dialogue"]');
  }
}
