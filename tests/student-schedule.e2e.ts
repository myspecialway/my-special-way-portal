import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';
import { filterErrorsAndWarnings } from '@angular/compiler-cli';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();

fixture(`Student Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToStudentsPage;
    await studentPage.createNewScheduleTestUser();
    await studentPage.navigateToScheduleTab();
  });

test('should open popup on click on cell', async (t) => {
  await t.click(studentPage.scheduleCell);
  await t.expect(studentPage.editCellDialogue.exists).ok();
});

async function createNewScheduleCell(t) {
  await t.expect(studentPage.scheduleCell.textContent).contains('add');
  await t.click(studentPage.scheduleCell);
  await t.click(studentPage.editCellLesson);
  await t.click(studentPage.lessonOption);
  await t.click(studentPage.editCellLocation);
  await t.click(studentPage.locationOption);
}

test('should update existing cell,should create lesson+location on empty cell', async (t) => {
  await createNewScheduleCell(t);
  await t.click(studentPage.editCellUpdateButton);
  await t.expect(studentPage.scheduleCell.textContent).contains('אומנות0 מעלית קומה');
  await t.expect(studentPage.scheduleCell.textContent).notContains('add');
});

test('should be able to discard changes inside popup', async (t) => {
  await createNewScheduleCell(t);
  await t.click(studentPage.editCellCloseButton);
  await t.expect(studentPage.scheduleCell.textContent).notContains('אומנות0 מעלית קומה');
  await t.expect(studentPage.scheduleCell.textContent).contains('add');
});
