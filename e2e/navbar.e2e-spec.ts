import { LoginPage } from './pageobjects/login.po';
import { NavbarPage } from './pageobjects/navbar.po';
import { browser } from 'protractor';
import { StudentPage } from './pageobjects/student.po';

describe('navbar component e2e tests', () => {
  let loginPage: LoginPage;
  let navbar: NavbarPage;
  let studentPage: StudentPage;
  beforeAll (() => {
    browser.driver.manage().window().maximize();
  });
  beforeEach(() => {
    loginPage = new LoginPage();
    navbar = new NavbarPage();
    studentPage = new StudentPage();

  });

  xit('should update navbar with username after login', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    loginPage.waitToLoad();
    // browser.sleep(10000);
    expect(navbar.getUserName().getText()).toContain('MSW-TEACHER');
  });
  it('should remove username from navbar after logout', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    studentPage.waitToLoad();
    navbar.logout();
    expect(navbar.getUserName().isPresent()).toBeFalsy();
  });
});
