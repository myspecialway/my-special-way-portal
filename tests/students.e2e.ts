import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();

fixture(`Student tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToStudentsPage;
    await studentPage.createNewScheduleTestUser();
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
    .expect(studentPage.firstNameErr.exists)
    .eql(true)
    .expect(studentPage.lastNameErr.exists)
    .eql(true)
    .expect(studentPage.usernameErr.exists)
    .eql(true)
    .expect(studentPage.classIdErr.exists)
    .eql(true)
    .expect(studentPage.passwordErr.exists)
    .eql(true)
    .typeText(studentPage.username, 'a')
    .expect(studentPage.usernameFormatErr.exists)
    .eql(true)
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});

test('new student password less than 8 characters', async (t) => {
  await navbar.navigateToStudentsPage();
  await t

    .click(studentPage.newStudentButton)
    .typeText(studentPage.password, 'Aa123')
    .pressKey('tab')
    .expect(studentPage.passwordFormatErr.exists)
    .eql(true)
    .expect(studentPage.passwordFormatErr.innerText)
    .eql('הסיסמא צריכה להכיל לפחות 8 תווים, כולל אותיות ומספרים')
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});

test('new student password not contains numbers', async (t) => {
  await navbar.navigateToStudentsPage();
  await t

    .click(studentPage.newStudentButton)
    .typeText(studentPage.password, 'abcdefghit')
    .pressKey('tab')
    .expect(studentPage.passwordFormatErr.exists)
    .eql(true)
    .expect(studentPage.passwordFormatErr.innerText)
    .eql('הסיסמא צריכה להכיל לפחות 8 תווים, כולל אותיות ומספרים')
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});

test('userName less than 5 characters', async (t) => {
  await navbar.navigateToStudentsPage();
  await t

    .click(studentPage.newStudentButton)
    .typeText(studentPage.username, 'abcd')
    .pressKey('tab')
    .expect(studentPage.usernameFormatErr.exists)
    .eql(true)
    .expect(studentPage.usernameFormatErr.innerText)
    .eql('שם משתמש חייב להיות לפחות חמישה תווים')
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});

test('only alphanumeric on userName', async (t) => {
  await navbar.navigateToStudentsPage();
  await t

    .click(studentPage.newStudentButton)
    .typeText(studentPage.username, 'abcd,')
    .pressKey('tab')
    .expect(studentPage.usernameFormatErr.exists)
    .eql(true)
    .expect(studentPage.usernameFormatErr.innerText)
    .eql('שם משתמש יכול להכיל אותיות וספרות בלבד')
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});

test('student`s userName already taken', async (t) => {
  await navbar.navigateToStudentsPage();
  await t
    .click(studentPage.newStudentButton)
    .typeText(studentPage.username, studentPage.userName)
    .pressKey('tab')
    .expect(studentPage.usernameFormatErr.exists)
    .eql(true)
    .expect(studentPage.usernameFormatErr.innerText)
    .eql('שם משתמש כבר קיים. אנא נסה שם משתמש אחר')
    .expect(studentPage.saveButton.hasAttribute('ng-reflect-disabled'))
    .eql(true);
});
