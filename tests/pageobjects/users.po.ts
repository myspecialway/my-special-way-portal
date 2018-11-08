import { Selector, t } from 'testcafe';

export default class UsersPage {
  static url = '/user';
  userName: string;
  _id: Selector;
  userNameSelector: Selector;
  userDeleteButton: Selector;
  userDeleteButtonConfirmation: Selector;
  addNewUserButton: Selector;
  firstNameField: Selector;
  lastNameField: Selector;
  userNameField: Selector;
  emailField: Selector;
  roleField: Selector;
  classField: Selector;
  userAddButton: Selector;
  roleFieldFirstOption: Selector;
  classFieldFirstOption: Selector;
  saveUserButton: Selector;
  userDeleteErr: Selector;
  rowNumber: Selector;
  rowNumberOfUser: number;

  constructor() {
    this.userName = 'testUser';
    this._id = Selector('[data-test-id$="users-page"]');
    this.userNameSelector = Selector('.mat-cell').withText(this.userName);
    this.rowNumber = Selector('.cdk-column-username');
    this.userDeleteButton = Selector('.cdk-column-deleteUser');
    this.userDeleteButtonConfirmation = Selector('span.mat-button-wrapper').withText('מחק');
    this.addNewUserButton = Selector('span.mat-button-wrapper').withText(' הוסף משתמש חדש ');
    this.firstNameField = Selector('[name$="firstname"]');
    this.lastNameField = Selector('[name$="lastname"]');
    this.userNameField = Selector('[name$="username"]');
    this.emailField = Selector('[name$="email"]');
    this.roleField = Selector('[name$="role"]');
    this.classField = Selector('[name$="class"]');
    this.saveUserButton = Selector('button.msw-button-submit');
    this.userDeleteErr = Selector('div.mat-dialog-content');
  }
  async createNewUser() {
    //If the user exists - delete it.
    try {
      if (await this.userNameSelector.visible) {
        await t.hover(this.userNameSelector).click(this.userDeleteButton.nth(await this.getRowNumber()));
        await t.click(this.userDeleteButtonConfirmation);
        await t.expect(this.userNameSelector.exists).notOk();
      }
    } catch (error) {}

    //Create a new User
    await t.click(this.addNewUserButton);
    await t.click(this.firstNameField);
    await t.typeText(this.firstNameField, 'TestUser');
    await t.typeText(this.lastNameField, 'TestUser');
    await t.typeText(this.emailField, 'test@test.att.com');
    await t.typeText(this.userNameField, this.userName);
    await t.click(this.roleField);
    await t.pressKey('down');
    await t.pressKey('enter');
    await t.click(this.classField);
    await t.pressKey('down');
    await t.pressKey('enter');
    await t.doubleClick(this.saveUserButton);
  }

  async getRowNumber() {
    this.rowNumberOfUser = await this.rowNumber.count;
    return this.rowNumberOfUser - 1;
  }
}
