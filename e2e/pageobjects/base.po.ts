import { browser } from 'protractor';
import { By } from '@angular/platform-browser';

export class BasePage {

  waitForElement(locator: By) {
    browser.driver.wait(() => {
      return browser.driver.isElementPresent(locator);
    }, 5000);
 }

  waitForUrl(expectedUrlFragment: string) {
    browser.driver.wait(() => {
      return browser.driver.getCurrentUrl().then( (url) => {
        return new RegExp(expectedUrlFragment).test(url);
      });
    }, 5000);
  }

}
