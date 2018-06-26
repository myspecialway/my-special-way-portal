import { browser, Locator } from 'protractor';
import { By } from '@angular/platform-browser';

export class BasePage {

  waitForElement(locator: By) {
    browser.driver.wait(() => {
      return browser.driver.isElementPresent(locator);
    }, 5000);
 }

}
