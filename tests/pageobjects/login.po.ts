import { Selector, t } from 'testcafe';

export default class LoginPage {
  useranmeField: Selector;
  passwordField: Selector;
  loginButton: Selector;
  emptyPasswordErr: Selector;
  emptyUsernameErr: Selector;
  wrongCredentialsErr: Selector;
  headerUserName: Selector;
  logout: Selector;

  url: string;
  constructor() {
    this.useranmeField = Selector('[name$="username"]');
    this.passwordField = Selector('[name$="password"]');
    this.loginButton = Selector('.mat-button');
    this.emptyPasswordErr = Selector('[data-test-id$="empty-password-err"]');
    this.emptyUsernameErr = Selector('[data-test-id$="empty-username-err"]');
    this.wrongCredentialsErr = Selector('[data-test-id$="wrong-credentials-err"]');
    this.url = '/login';
    this.headerUserName = Selector('.msw-header-user-name');
    this.logout = Selector('#logout');
  }

  async loginAsPrinciple() {
    await this.login('principle', 'Aa123456');
  }

  async loginAsTeacher() {
    await this.login('teacher', 'Aa123456');
  }

  async loginAsStudent() {
    await this.login('student', 'Aa123456');
  }

  async login(username: string, password: string) {
    await t
      .maximizeWindow()
      .typeText(this.useranmeField, username)
      .typeText(this.passwordField, password)
      .click(this.loginButton);
  }

  async clearLoginInputFields() {
    await t
      .selectText(this.useranmeField)
      .pressKey('delete')
      .selectText(this.passwordField)
      .pressKey('delete');
  }

  async assertLoginNameDisplayed(userName: string) {
    await t.expect(this.headerUserName.innerText).contains(userName);
  }
}
