import { Selector, t } from 'testcafe';

export default class UsersPage {
  static url = '/user';
  userName: string;
  _id: Selector;
  newUserButton: Selector;
  username: Selector;
  firstName: Selector;
  lastName: Selector;
  email: Selector;
  role: Selector;
  roleFirstOption: Selector;
  classId: Selector;
  classIdFirstOption: Selector;
  usernameErr1: Selector;
  usernameErr2: Selector;
  firstNameErr: Selector;
  lastNameErr: Selector;
  classErr: Selector;
  emailErr1: Selector;
  emailErr2: Selector;
  roleErr: Selector;
  saveButton: Selector;
  userTestUserNameCell: Selector;
  userTestUserDeleteButton: Selector;
  confirmDeleteButton: Selector;
  url: string | null;
  constructor() {
    this.userName = 'tester';
    this._id = Selector('[data-test-id$="users-page"]');
    this.url = null;
    this.newUserButton = Selector('[data-test-id$="add-new-user-button"]');
    this.username = Selector('[name$="username"]');
    this.firstName = Selector('[name$="firstname"]');
    this.lastName = Selector('[name$="lastname"]');
    this.email = Selector('[name$="email"]');
    this.role = Selector('[name$="role"]');
    this.roleFirstOption = Selector('[class="mat-option-text"]').withExactText('מנהל');
    this.classId = Selector('[name$="class"]');
    this.classIdFirstOption = Selector('[class="mat-option-text"]').withExactText('טיטאן');
    this.usernameErr1 = Selector('[data-test-id$="username-err1"]');
    this.usernameErr2 = Selector('[data-test-id$="username-err2"]');
    this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
    this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
    this.classErr = Selector('[data-test-id$="class-err"]');
    this.emailErr1 = Selector('[data-test-id$="email-err1"]');
    this.emailErr2 = Selector('[data-test-id$="email-err2"]');
    this.roleErr = Selector('[data-test-id$="role-err"]');
    this.saveButton = Selector('[data-test-id$="submit-button"]');
    this.userTestUserNameCell = Selector('.username').withText(this.userName);
    this.userTestUserDeleteButton = Selector('[data-test-id$="delete-user-button-' + this.userName + '"]');
    this.confirmDeleteButton = Selector('[id$="confirm-delete-user"]');
  }

  /**
   * create new user
   * @returns {Promise<void>}
   */
  async deleteExistingUserTestUser() {
    await t.click(this.userTestUserDeleteButton);
    await t.click(this.confirmDeleteButton);
    await t.expect(this.userTestUserNameCell.exists).notOk();
  }

  /**
   * create new user
   * @returns {Promise<void>}
   */
  async createNewUserTestUser() {
    //If the user exists - delete it.
    try {
      if (await this.userTestUserNameCell.visible) {
        this.deleteExistingUserTestUser();
      }
    } catch (error) {}

    //Create a new userTestUser
    await t.click(this.newUserButton);
    await this.firstName();
    await t.typeText(this.firstName, 'Bla');
    await t.typeText(this.lastName, 'Bla');
    await t.typeText(this.username, this.userName);
    await t.typeText(this.email, 'blabla@gmail.com');
    await t.click(this.role);
    await t.click(this.roleFirstOption);
    await t.click(this.classId);
    await t.click(this.classIdFirstOption);
    await t.click(this.saveButton);
    //user should now exist
    await t.expect(this.userTestUserNameCell.exists).ok();
  }

  /**
   * create new user
   * @returns {Promise<void>}
   */
  async testMissingDetailsTestUser() {
    //No first name
    await t.click(this.newUserButton);
    await this.firstName();
    await t.click(this.saveButton);
    await t.expect(this.firstNameErr.exists).ok();
    // No last name
    await t.click(this.lastName);
    await t.click(this.saveButton);
    await t.expect(this.lastNameErr.exists).ok();
    //No user name
    await t.click(this.username);
    await t.click(this.saveButton);
    await t.expect(this.usernameErr1.exists).ok();
    //User name not in English
    await t.typeText(this.username, 'אבגדה');
    await t.click(this.saveButton);
    await t.expect(this.usernameErr2.exists).ok();
    //No email
    await t.click(this.email);
    await t.click(this.saveButton);
    await t.expect(this.emailErr1.exists).ok();
    //Email not valid
    await t.click(this.email);
    await t.typeText(this.email, 'blabla');
    await t.click(this.saveButton);
    await t.expect(this.emailErr2.exists).ok();
    //No role
    await t.click(this.role);
    await t.click(this.saveButton);
    await t.expect(this.roleErr.exists).ok();
    //No Class
    await t.click(this.classId);
    await t.click(this.saveButton);
    await t.expect(this.classErr.exists).ok();
  }
}
