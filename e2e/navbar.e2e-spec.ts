import { LoginPage } from './pageobjects/login.po';
import { DashboardPage } from './pageobjects/dashboard.po';
import { NavbarPage } from './pageobjects/navbar.po';
import { browser } from 'protractor';

describe('navbar component e2e tests', () => {
  let loginPage: LoginPage;
  let navbar: NavbarPage;
  beforeAll (() => {
    browser.driver.manage().window().maximize();
  });
  beforeEach(() => {
    loginPage = new LoginPage();
    navbar = new NavbarPage();

  });

  it('should update navbar with username after login', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    loginPage.waitToLoad();
    // browser.sleep(10000);
    expect(navbar.getUserName()).toContain('MSW-TEACHER');
  });
  it('should remove username from  navbar after logout', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    loginPage.waitToLoad();
    // browser.sleep(10000);
    navbar.logout();
    expect(navbar.getUserName()).toBeNull();
  });
});
