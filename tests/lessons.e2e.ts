import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import { Selector, t } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();
const classesPage = new ClassesPage();

fixture(`Lessons tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToLessonsPage();
  });
