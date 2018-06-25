import { browser, by, element } from 'protractor';

export class NavbarPage {

  // navigateTo() {
  //   return browser.get('/');
  // }

  // getPageUrl() {
  //   return browser.getCurrentUrl();
  // }

  getUserName() {
    return element(by.className('msw-header-user-name')).getText();
  }
  logout() {
    element(by.id('navbarDropdownMenuLink')).click();
    element(by.xpath('//*[@class="dropdown-item"][2]')).click();
    browser.waitForAngular();
  }
}
