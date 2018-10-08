import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classesPage = new ClassesPage();

//TODO - after test delete classes
fixture(`Class Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await classesPage.createNewScheduleTestClass();
  });

test('should open popup on click on cell', async (t) => {
  await t.click(classesPage.scheduleCell);
  await t.expect(classesPage.editCellDialogue.exists).ok();
});

test('should update existing cell,should create lesson+location on empty cell', async (t) => {
  await classesPage.createNewScheduleCell();
  await t.click(classesPage.editCellUpdateButton);
  //TODO - this currently fails because of bug #264
  await t.expect(classesPage.scheduleCell.textContent).contains('אומנות0 מעלית קומה');
  await t.expect(classesPage.scheduleCell.textContent).notContains('add');
});

test('should be able to discard changes inside popup', async (t) => {
  await classesPage.createNewScheduleCell();
  await t.click(classesPage.editCellCloseButton);
  await t.expect(classesPage.scheduleCell.textContent).notContains('אומנות0 מעלית קומה');
  await t.expect(classesPage.scheduleCell.textContent).contains('add');
}

//TODO - fix test
test('Class name, grade and back-to-classes button should not be visible', async (t) => {
  await loginPage.loginAsTeacher();
  await navbar.navigateToClassSchedulePage();
  await t
    .expect(classDetailsPage.classNameInput.exists)
    .notOk()
    .expect(classDetailsPage.gradeSelect.exists)
    .notOk()
    .expect(classDetailsPage.backToClassButton.exists)
    .notOk();
});
