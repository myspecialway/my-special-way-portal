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

//TODO - after test delete classes
fixture(`Class Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await createNewScheduleTestClass();
  });

async function createNewScheduleTestClass() {
  //If the class exists - delete it.
  if (await classesPage.scheduleTestClassNameCell.exists) {
    await t.click(classesPage.scheduleTestClassDeleteButton).click(classesPage.confirmDeleteButton);
  }
  //If the class still exists - fail the test
  await t.expect(classesPage.scheduleTestClassNameCell.exists).notOk();

  //Create a new scheduleTestClass
  await t.click(classesPage.newClassButton);
  await t.typeText(classDetailsPage.classNameInput, 'scheduleTestClass');
  await t.click(classDetailsPage.gradeSelect);
  await t.click(classDetailsPage.gradeSelectOption.withExactText('א'));

  //Leave the class details page and verify that the class is created
  await t.click(classDetailsPage.backToClassButton);
  await t.expect(classesPage.scheduleTestClassNameCell.exists).ok();
  await t.click(classesPage.scheduleTestClassNameCell);
}

async function createNewScheduleCell() {
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('add');
  await t.click(classDetailsPage.scheduleEmptyCell);
  await t.click(classDetailsPage.editCellLesson);
  await t.click(classDetailsPage.lessonOption);
  await t.click(classDetailsPage.editCellLocation);
  await t.click(classDetailsPage.locationOption);
}

test('should open popup on click on cell', async () => {
  await t.click(classDetailsPage.scheduleEmptyCell);
  await t.expect(classDetailsPage.editCellDialogue.exists).ok();
});

test('should update existing cell,should create lesson+location on empty cell', async () => {
  await createNewScheduleCell();
  await t.click(classDetailsPage.editCellUpdateButton);
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('אומנות0 מעלית קומה');
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).notContains('add');
});

test('should be able to discard changes inside popup', async () => {
  await createNewScheduleCell();
  await t.click(classDetailsPage.editCellCloseButton);
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).notContains('אומנות0 מעלית קומה');
  await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('add');
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
