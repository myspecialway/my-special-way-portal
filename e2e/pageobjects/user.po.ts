import { browser, by, element } from 'protractor';

export class UserPage {

  navigateTo(link: string) {
    return browser.get('/user'.concat(link));
  }

  getPageUrl() {
    return browser.getCurrentUrl();
  }

  login(user: string, pass: string) {
    element(by.name('username')).sendKeys(user);
    element(by.name('password')).sendKeys(pass);
    element(by.className('mat-button')).click();
    browser.waitForAngular();
  }
}
