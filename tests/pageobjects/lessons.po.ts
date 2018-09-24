import { Selector } from 'testcafe';

export default class LessonsPage {
  static url = '/lesson';
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="lessons-page"]');
  }
}
