import { Selector } from 'testcafe';

export default class ClassesPage {
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="classes-page"]');
  }
}
