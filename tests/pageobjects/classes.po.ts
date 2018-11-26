import { Selector } from 'testcafe';
import ClassDetailsPage from './class-details.po';

export default class ClassesPage {
  static url = '/class';
  _id: Selector;
  classNameCell: Selector;
  addClassButton: Selector;
  deleteClassDialogDeleteButton: Selector;
  scheduleTestClassNameCell: Selector;
  scheduleTestClassDeleteButton: Selector;
  confirmDeleteButton: Selector;
  // newClassButton: Selector;
  classDetailsPage: ClassDetailsPage;

  constructor() {
    this.classDetailsPage = new ClassDetailsPage();
    this._id = Selector('[data-test-id$="classes-page"]');
    this.classNameCell = Selector('.class-name');
    this.addClassButton = Selector('[data-test-id="add-class-button"]');
    this.deleteClassDialogDeleteButton = Selector('[data-test-id="delete-button"]');
    this.scheduleTestClassNameCell = Selector('.class-name').withExactText('scheduleTestClass');
    this.scheduleTestClassDeleteButton = Selector('[data-test-id$="delete-class-button-scheduleTestClass"]');
    this.confirmDeleteButton = Selector('[data-test-id$="delete-button"]');
    // this.newClassButton = Selector('[data-test-id$="add-class-button"]');
  }
}
