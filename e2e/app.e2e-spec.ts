import { LoginPage } from './pageobjects/login.po';
import { DashboardPage } from './pageobjects/dashboard.po';
import { element , by } from 'protractor';

describe('msw-client App', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
  });

  it('should display Login message', () => {
    loginPage.navigateTo();
    expect(loginPage.getParagraphText()).toEqual('Login');
  });
  it('should fail login with bad creds', () => {
    loginPage.navigateTo();
    loginPage.login('msw1', '123');
    expect(dashboardPage.getParagraphText()).toBeUndefined();
  });
  it('should login with good creds', () => {
    loginPage.navigateTo();
    loginPage.login('msw', 'Aa123456');
    expect(dashboardPage.getParagraphText()).toContain('Dashboard');
  });
});
