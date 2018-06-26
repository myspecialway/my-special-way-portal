import { LoginPage } from './pageobjects/login.po';
import { NavbarPage } from './pageobjects/navbar.po';
import { browser } from 'protractor';
import { StudentPage } from './pageobjects/student.po';
import { UserPage } from './pageobjects/user.po';

describe('msw-client App navbar component ', async () => {
  let loginPage: LoginPage;
  let navbar: NavbarPage;
  let studentPage: StudentPage;
  let userPage: UserPage;
  beforeAll (() => {
    browser.driver.manage().window().maximize();
  });
  beforeEach(async () => {
    loginPage = new LoginPage();
    navbar = new NavbarPage();
    studentPage = new StudentPage();
    userPage = new UserPage();
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    studentPage.waitToLoad();
  });

  xit('should update navbar with username after login',  () => {
    expect(navbar.getUserName().getText()).toContain('MSW-TEACHER');
  });
  xit('should remove username from navbar after logout',  () => {
    navbar.logout();
    expect(navbar.getUserName().isPresent()).toBeFalsy();
  });

  xit('should navigate to users when choosing users in navigation dropdown',  () => {
    navbar.navigateToUsers();
    expect(userPage.getPageUrl()).toContain('user');
  });
  xit('should navigate to students when choosing students in navigation dropdown',  () => {
    navbar.navigateToUsers();
    navbar.navigateToStudents();
    expect(studentPage.getPageUrl()).toContain('student');
  });
  xit('should navigate to classes when choosing classes in navigation dropdown',  () => {
    navbar.navigateToClasses();
    expect(userPage.getPageUrl()).toContain('class');
  });
  xit('should navigate to map when choosing map in navigation dropdown',  () => {
    navbar.navigateToMap();
    browser.sleep(1000);
    expect(userPage.getPageUrl()).toContain('map');
  });
});
