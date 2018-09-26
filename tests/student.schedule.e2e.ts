import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/student.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();

fixture(`Student tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await t
      .typeText(loginPage.useranmeField, 'principle')
      .typeText(loginPage.passwordField, 'Aa123456')
      .click(loginPage.loginButton)
      .click(navbar.menuDropDown)
      .click(navbar.menuDropDownStudents);
    //If the user still exists - delete it.
    if (await studentPage.scheduleTestUserNameCell.exists) {
      await t.click(studentPage.scheduleTestUserDeleteButton).click(studentPage.confirmDeleteButton);
    }
    //If the user still exists - fail the test
    await t.expect(studentPage.scheduleTestUserNameCell.exists).notOk();
    //Create a new scheduleTestUser
    await t.click(studentPage.newStudentButton);
    await studentPage.firstName();
    await t.typeText(studentPage.username, 'scheduleTestUser');
    await t.typeText(studentPage.password, 'scheduleTestUser');
    await t.typeText(studentPage.firstName, 'scheduleTestUser');
    await t.typeText(studentPage.lastName, 'scheduleTestUser');
    await t.click(studentPage.classId);
    await t.click(studentPage.classIdFirstChoice);
    await t.click(studentPage.saveButton);

    //user should now exist
    await t.expect(studentPage.scheduleTestUserNameCell.exists).ok();

    //Navigate top the schedule screen
    await t.click(studentPage.scheduleTestUserNameCell);
    await t.click(studentPage.scheduleTab);
  });

test('should open popup on click on cell', async (t) => {
  await t.click(studentPage.scheduleCell);
  await t.expect(studentPage.editCellDialogue.exists).ok();
});

test('should update existing cell,should create lesson+location on empty cell', async (t) => {
  await t.click(studentPage.scheduleCell);
  await t.click(studentPage.editCellLesson);
  await t.click(studentPage.lessonOption);
  await t.click(studentPage.editCellLocation);
  await t.click(studentPage.locationOption);
  await t.click(studentPage.editCellUpdateButton);
  //This currently fails because of a bug in the update button.
  await t.expect(studentPage.scheduleCell.textContent).contains('אומנות');
  await t.expect(studentPage.scheduleCell.textContent).contains('מעלית קומה 0');
});

test('should be able to discard changes inside popup', async (t) => {
  await t.click(studentPage.scheduleCell);
  await t.click(studentPage.editCellLesson);
  await t.click(studentPage.lessonOption);
  await t.click(studentPage.editCellLocation);
  await t.click(studentPage.locationOption);
  await t.click(studentPage.editCellCloseButton);
  //This currently fails because of a bug in the update button.
  await t.expect(studentPage.scheduleCell.textContent).notContains('אומנות');
  await t.expect(studentPage.scheduleCell.textContent).notContains('מעלית קומה 0');
  await t.expect(studentPage.scheduleCell.textContent).contains('add');
});
