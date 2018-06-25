import { LoginPage } from './pageobjects/login.po';
import { DashboardPage } from './pageobjects/dashboard.po';

describe('msw-client App', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
  });

  it('should fail login with bad creds', () => {
    loginPage.navigateTo('');
    loginPage.login('msw1', '123');
    expect(dashboardPage.getPageUrl()).toContain('login');
  });
  it('should login with good creds', () => {
    loginPage.navigateTo('');
    loginPage.login('msw-teacher', 'Aa123456');
    expect(dashboardPage.getPageUrl()).toContain('student');
  });
  it('should login with good creds and navigate to return Url', () => {
    loginPage.navigateTo('?returnUrl=%2Fclass');
    loginPage.login('msw-teacher', 'Aa123456');
    expect(dashboardPage.getPageUrl()).not.toContain('login');
  });
});
