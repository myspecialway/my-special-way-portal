import { Selector, t } from 'testcafe';

export default class LoginPage {
  useranmeField: Selector;
  passwordField: Selector;
  loginButton: Selector;
  url: string;
  constructor() {
    this.useranmeField = Selector('[name$="username"]');
    this.passwordField = Selector('[name$="password"]');
    this.loginButton = Selector('.mat-button');
    this.url = '/login';
  }

  async loginAsPrinciple() {
    await t
      .maximizeWindow()
      .typeText(this.useranmeField, 'principle')
      .typeText(this.passwordField, 'Aa123456')
      .click(this.loginButton);
  }

  async loginAsTeacher() {
    await t
      .maximizeWindow()
      .typeText(this.useranmeField, 'teacher')
      .typeText(this.passwordField, 'Aa123456')
      .click(this.loginButton);
  }
}
