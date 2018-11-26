import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import StudentDetailsPage from './pageobjects/students.po';
import { t } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classesPage = new ClassesPage();
const classDetailsPage = new ClassDetailsPage();
const studentPage = new StudentDetailsPage();

fixture(`Class Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await createNewScheduleTestClass();
    await studentPage.findEmptyCell(await studentPage.getStudentScheduleTableRowsNumber());
  });

async function createNewScheduleTestClass() {
  // If the class exists - delete it.
  if (await classesPage.scheduleTestClassNameCell.exists) {
    await t
      .hover(classesPage.scheduleTestClassNameCell)
      .click(classesPage.scheduleTestClassDeleteButton)
      .click(classesPage.confirmDeleteButton);
  }
  // If the class still exists - fail the test
  await t.expect(classesPage.scheduleTestClassNameCell.exists).notOk();
  await t
    // Create a new scheduleTestClas
    .setTestSpeed(0.1)
    .click(classesPage.addClassButton)
    .typeText(classDetailsPage.classNameInput, 'scheduleTestClass')
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('א'))
    .setTestSpeed(0.1)
    // Leave  the class details page and verify that the class is create
    .click(classDetailsPage.backToClassButton)
    .setTestSpeed(0.5)
    .expect(classesPage.scheduleTestClassNameCell.exists)
    .ok()
    .click(classesPage.scheduleTestClassNameCell);
}

async function createNewScheduleCell() {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .debug()
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.lessonOption)
    .click(classDetailsPage.editCellLocation)
    .click(classDetailsPage.locationOption);
}

test('should open popup on click on cell', async () => {
  await t
    .click(studentPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellDialogue.exists)
    .ok();
});

test('should update existing cell,should create lesson+location on empty cell', async () => {
  await createNewScheduleCell();
  await t
    .click(classDetailsPage.editCellUpdateButton)
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('אומנות0 מעלית קומה')
    .expect(studentPage.scheduleEmptyCell.textContent)
    .notContains('add');
});

test('should be able to discard changes inside popup', async () => {
  await createNewScheduleCell();
  await t
    .click(classDetailsPage.editCellCloseButton)
    .expect(studentPage.scheduleEmptyCell.textContent)
    .notContains('אומנות0 מעלית קומה')
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add');
});

test('Class name, grade and back-to-classes button should not be visible', async () => {
  await t.click(navbar.toolsDropDown).click(navbar.logoutMenuItem);
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
