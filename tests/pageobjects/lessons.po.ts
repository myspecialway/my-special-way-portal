import { Selector } from 'testcafe';

export default class LessonsPage {
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="lessons-page"]');
  }
}
