import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import { t } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classesPage = new ClassesPage();
const classDetailsPage = new ClassDetailsPage();

fixture(`Class Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await createNewScheduleTestClass();
  });

async function createNewScheduleTestClass() {
  // If the class exists - delete it.
  if (await classesPage.scheduleTestClassNameCell.exists) {
    await t.click(classesPage.scheduleTestClassDeleteButton).click(classesPage.confirmDeleteButton);
  }
  // If the class still exists - fail the test
  await t
    .expect(classesPage.scheduleTestClassNameCell.exists)
    .notOk()
    // Create a new scheduleTestClass
    .click(classesPage.newClassButton)
    .typeText(classDetailsPage.classNameInput, 'scheduleTestClass')
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('א'))
    // Leave  the class details page and verify that the class is create
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.scheduleTestClassNameCell.exists)
    .ok()
    .click(classesPage.scheduleTestClassNameCell);
}

async function createNewScheduleCell() {
  await t
    .expect(classDetailsPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(classDetailsPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.lessonOption)
    .click(classDetailsPage.editCellLocation)
    .click(classDetailsPage.locationOption);
}

test('should open popup on click on cell', async () => {
  await t
    .click(classDetailsPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellDialogue.exists)
    .ok();
});

test('should update existing cell,should create lesson+location on empty cell', async () => {
  await createNewScheduleCell();
  await t
    .click(classDetailsPage.editCellUpdateButton)
    .expect(classDetailsPage.scheduleEmptyCell.textContent)
    .contains('אומנות0 מעלית קומה')
    .expect(classDetailsPage.scheduleEmptyCell.textContent)
    .notContains('add');
});

test('should be able to discard changes inside popup', async () => {
  await createNewScheduleCell();
  await t
    .click(classDetailsPage.editCellCloseButton)
    .expect(classDetailsPage.scheduleEmptyCell.textContent)
    .notContains('אומנות0 מעלית קומה')
    .expect(classDetailsPage.scheduleEmptyCell.textContent)
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
