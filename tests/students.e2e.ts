import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();

fixture(`Student tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
  });

test('new and existing student form error messages display correctly', async (t) => {
  await navbar.navigateToStudentsPage();
  await t
    .click(studentPage.newStudentButton)
    .click(studentPage.firstName)
    .click(studentPage.lastName)
    .click(studentPage.classId)
    .pressKey('tab') // just to close the drop down
    .click(studentPage.password)
    .click(studentPage.username)
    .pressKey('tab') // just to leave the previous field.Z
    .expect(studentPage.firstNameErr().exists)
    .ok()
    .expect(studentPage.lastNameErr().exists)
    .ok()
    .expect(studentPage.usernameErr().exists)
    .ok()
    .expect(studentPage.classIdErr().exists)
    .ok()
    .expect(studentPage.passwordErr().exists)
    .ok()
    .typeText(studentPage.username, 'a')
    .expect(studentPage.usernameFormatErr().exists)
    .ok()
    .expect(studentPage.saveButton.hasAttribute('disabled'))
    .ok();
});

test('new student password less than 8 characters', async (t) => {
  // await navbar.navigateToStudentsPage();
  // await t
  //   .click(studentPage.newStudentButton)
  //   .click(studentPage.firstName)
  //   .click(studentPage.lastName)
  //   .click(studentPage.classId)
  //   .pressKey('tab') // just to close the drop down
  //   .click(studentPage.password)
  //   .click(studentPage.username)
  //   .pressKey('tab') // just to leave the previous field.Z
  //   .expect(studentPage.firstNameErr().exists)
  //   .ok()
  //   .expect(studentPage.lastNameErr().exists)
  //   .ok()
  //   .expect(studentPage.usernameErr().exists)
  //   .ok()
  //   .expect(studentPage.classIdErr().exists)
  //   .ok()
  //   .expect(studentPage.passwordErr().exists)
  //   .ok()
  //   .typeText(studentPage.username, 'a')
  //   .expect(studentPage.usernameFormatErr().exists)
  //   .ok()
  //   .expect(studentPage.saveButton.hasAttribute('disabled'))
  //   .ok();
});

test('new student password not contains numbers', async (t) => {
  // await navbar.navigateToStudentsPage();
  // await t
  //   .click(studentPage.newStudentButton)
  //   .click(studentPage.firstName)
  //   .click(studentPage.lastName)
  //   .click(studentPage.classId)
  //   .pressKey('tab') // just to close the drop down
  //   .click(studentPage.password)
  //   .click(studentPage.username)
  //   .pressKey('tab') // just to leave the previous field.Z
  //   .expect(studentPage.firstNameErr().exists)
  //   .ok()
  //   .expect(studentPage.lastNameErr().exists)
  //   .ok()
  //   .expect(studentPage.usernameErr().exists)
  //   .ok()
  //   .expect(studentPage.classIdErr().exists)
  //   .ok()
  //   .expect(studentPage.passwordErr().exists)
  //   .ok()
  //   .typeText(studentPage.username, 'a')
  //   .expect(studentPage.usernameFormatErr().exists)
  //   .ok()
  //   .expect(studentPage.saveButton.hasAttribute('disabled'))
  //   .ok();
});
