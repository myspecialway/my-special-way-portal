import { Selector } from 'testcafe';

export default class UsersPage {
  static url = '/user';
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="users-page"]');
  }
}
