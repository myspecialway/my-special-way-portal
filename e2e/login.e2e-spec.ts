import { LoginPage } from './pageobjects/login.po';
import { browser } from 'protractor';

describe('msw-client App login page', () => {
  let loginPage: LoginPage;
  beforeAll (() => {
    browser.driver.manage().window().maximize();
  });
  beforeEach(() => {
    loginPage = new LoginPage();
  });

  it('should fail login with bad creds', () => {
    loginPage.navigateTo('');
    loginPage.login('msw1', '123');
    expect(loginPage.getPageUrl()).toContain('login');
  });
  it('should login with good creds', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    expect(loginPage.getPageUrl()).toContain('student');
  });
  it('should login with good creds and navigate to return Url', () => {
    loginPage.navigateTo('?returnUrl=%2Fclass');
    loginPage.login('msw-teacher', 'Aa123456');
    expect(loginPage.getPageUrl()).not.toContain('login');
  });
});
