import { Selector } from 'testcafe';

export default class UsersPage {
  _id: Selector;
  constructor() {
    this._id = Selector('[data-test-id$="users-page"]');
  }
}
