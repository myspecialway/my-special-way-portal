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
  it('should login', () => {
    loginPage.navigateTo();
    expect(dashboardPage.getParagraphText()).toContain('Dashboard');
  });
});
