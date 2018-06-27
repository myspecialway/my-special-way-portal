import { browser, by, element } from 'protractor';
import { BasePage } from './base.po';

export class NavbarPage extends BasePage {

  getUserName() {
    return element(by.className('msw-header-user-name'));
  }
  async logout()  {
    this.waitForElement(by.id('navbarDropdownMenuLink'));
    element(by.id('navbarDropdownMenuLink')).click();
    await element(by.xpath('//*[@class="dropdown-item"][@href="/login"]')).isEnabled();
    element(by.xpath('//*[@class="dropdown-item"][@href="/login"]')).click();
    await browser.waitForAngular();
  }
  async navigateToStudents() {
    await element(by.id('navbarDropdownMenuLink')).isEnabled();
    element(by.id('navbarDropdownMenuLink0')).click();
    await element(by.xpath('//*[@ng-reflect-router-link="student"]')).isEnabled();
    element(by.xpath('//*[@ng-reflect-router-link="student"]')).click();
    await browser.waitForAngular();
  }
  async navigateToClasses() {
    await element(by.id('navbarDropdownMenuLink')).isEnabled();
    element(by.id('navbarDropdownMenuLink0')).click();
    await element(by.xpath('//*[@ng-reflect-router-link="class"]')).isEnabled();
    element(by.xpath('//*[@ng-reflect-router-link="class"]')).click();
    await browser.waitForAngular();
  }
  async navigateToUsers() {
    await element(by.id('navbarDropdownMenuLink')).isEnabled();
    element(by.id('navbarDropdownMenuLink0')).click();
    await element(by.xpath('//*[@ng-reflect-router-link="user"]')).isEnabled();
    element(by.xpath('//*[@ng-reflect-router-link="user"]')).click();
    await browser.waitForAngular();
  }
  async navigateToMap() {
    await element(by.id('navbarDropdownMenuLink')).isEnabled();
    element(by.id('navbarDropdownMenuLink0')).click();
    await element(by.xpath('//*[@ng-reflect-router-link="map"]')).isEnabled();
    element(by.xpath('//*[@ng-reflect-router-link="map"]')).click();
    await browser.waitForAngular();
  }
}
