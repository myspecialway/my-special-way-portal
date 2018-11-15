import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';

const loginPage = new LoginPage();
const navbar = new NavbarPage();

fixture(`Lessons tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToLessonsPage();
  });
