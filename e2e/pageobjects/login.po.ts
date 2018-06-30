import { browser, by, element } from 'protractor';

export class LoginPage {

  async navigateTo(link: string)  {
     await browser.get('/login'.concat(link));
  }

  getPageUrl() {
    return browser.getCurrentUrl();
  }
  waitToLoad() {
    browser.waitForAngular();
  }
  login(user: string, pass: string) {
    element(by.name('username')).sendKeys(user);
    element(by.name('password')).sendKeys(pass);
    element(by.className('mat-button')).click();
    browser.waitForAngular();
  }
}
