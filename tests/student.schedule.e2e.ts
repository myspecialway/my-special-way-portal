import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import {testEnvironment} from './config/config';
import StudentPage from './pageobjects/student.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();

fixture(`Student tests`).page(testEnvironment.feUrl)
  .beforeEach( async (t) => {
    await t
      .typeText(loginPage.useranmeField, 'principle')
      .typeText(loginPage.passwordField, 'Aa123456')
      .click(loginPage.loginButton)
      .click(navbar.menuDropDown)
      .click(navbar.menuDropDownStudents);
    //If the user still exists - delete it.
    if (await studentPage.scheduleTestUserNameCell.exists) {
      await t
        .click(studentPage.scheduleTestUserDeleteButton)
        .click(studentPage.confirmDeleteButton);
    }
    //If the user still exists - fail the test
    await t.expect(studentPage.scheduleTestUserNameCell.exists).notOk();
    //Create a new scheduleTestUser
    await t.click(studentPage.newStudentButton);
    await studentPage.firstName();
  });

test('schedule for student is displayed correctly', async (t) => {

  await t.click(studentPage.firstName)
    .click(studentPage.lastName)
    .click(studentPage.classId)
    .click(studentPage.password) // just to close the drop down
    .click(studentPage.password)
    .click(studentPage.username)
    .click(studentPage.password); // just so we leave the previous field.
  await studentPage.firstNameErr().exists;
  await studentPage.lastNameErr().exists;
  await studentPage.usernameErr().exists;
  await studentPage.classIdErr().exists;
  await studentPage.passwordErr().exists;
  await t.typeText(studentPage.username, 'a');
  await studentPage.usernameFormatErr().exists;
  await t.expect(studentPage.saveButton.hasAttribute('disabled')).ok();
});
