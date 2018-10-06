import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';
import ClassDetailsPage from './pageobjects/class-details.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const classDetailsPage = new ClassDetailsPage();

fixture(`Student Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToStudentsPage;
    await studentPage.createNewScheduleTestUser();
    await studentPage.navigateToScheduleTab();
  });

test('should open popup on click on cell', async (t) => {
  await t.click(classDetailsPage.scheduleEmptyCell);
  await t.expect(classDetailsPage.editCellDialogue.exists).ok();
});

test('should update existing cell,should create lesson+location on empty cell', async (t) => {
  await classDetailsPage.createNewScheduleCell();
  await t.click(classDetailsPage.editCellUpdateButton);
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('אומנות0 מעלית קומה');
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).notContains('add');
});

test('should be able to discard changes inside popup', async (t) => {
  await classDetailsPage.createNewScheduleCell();
  await t.click(classDetailsPage.editCellCloseButton);
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).notContains('אומנות0 מעלית קומה');
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('add');
});
