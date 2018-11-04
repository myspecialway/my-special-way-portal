import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import MapPage from './pageobjects/map-details.po';
import { Triggers } from 'eyes.sdk';
import LessonsPage from './pageobjects/lessons.po';
import { Selector } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const classDetailsPage = new ClassDetailsPage();
const lessonPage = new LessonsPage();
const mapPage = new MapPage();

fixture(`Map tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await loginPage.loginAsPrinciple();
    await mapPage.getFloorList();
    await mapPage.getFullLocationsList();
  });

// test('should open popup on click on empty cell', async (t) => {
//   await t.click(studentPage.scheduleEmptyCell);
//   await t.expect(classDetailsPage.editCellDialogue.exists).ok();
// });
