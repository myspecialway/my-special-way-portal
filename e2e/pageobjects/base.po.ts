import { browser, Locator } from 'protractor';

export class BasePage {

  waitForElement(locator: Locator) {
    browser.driver.wait(() => {
      return browser.driver.isElementPresent(locator);
    }, 5000);
 }

}
