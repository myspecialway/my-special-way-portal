import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import {testEnvironment} from './config/config';
import { EyesDriver } from './eyes/eyes';
import StudentPage from './pageobjects/student.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const eye = new EyesDriver();

fixture(`Student tests`).page(testEnvironment.feUrl)
  .before(async (t) => {
    await eye.openEyes('Student tests');
  })
  .after(async (t) => {
    await eye.closeEyes();
  })
  .beforeEach( async (t) => {
    await t
      .typeText(loginPage.useranmeField, 'principle')
      .typeText(loginPage.passwordField, 'Aa123456')
      .click(loginPage.loginButton);
  });

test('new and existing student form error messages display correctly', async (t) => {
  await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownStudents)
    .click(studentPage.newStudentButton);
  await studentPage.firstName();
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
