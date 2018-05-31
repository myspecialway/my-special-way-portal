import { browser, by, element } from 'protractor';

export class DashboardPage {
  navigateTo() {
    return browser.get('/dashboard');
  }

  getParagraphText() {
    return element(by.className('navbar-brand')).getText();
  }

  login(user: string, pass: string) {
    element(by.name('username')).sendKeys(user);
    element(by.name('password')).sendKeys(pass);
    element(by.className('mat-button')).click();
  }
}
