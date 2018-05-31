import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getParagraphText() {
    return element(by.className('card-header')).getText();
  }

  login(user: string, pass: string) {
    element(by.name('username')).sendKeys(user);
    element(by.name('password')).sendKeys(pass);
    element(by.className('mat-button')).click();
  }
}
