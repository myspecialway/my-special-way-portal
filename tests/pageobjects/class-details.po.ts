import { Selector } from 'testcafe';

export default class ClassDetailsPage {
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="class-details-page"]');
  }
}
