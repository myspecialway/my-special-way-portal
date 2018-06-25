import { browser, by, element, until } from 'protractor';

export class NavbarPage {

  getUserName() {
    return element(by.className('msw-header-user-name'));
  }
  logout() {
    browser.sleep(4000);
    element(by.id('navbarDropdownMenuLink')).click();
    element(by.xpath('//*[@class="dropdown-item"][@href="/login"]')).click();
    browser.waitForAngular();
  }
}
