import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';
import UsersPage from './pageobjects/users.po';
import LessonsPage from './pageobjects/lessons.po';
import ClassesPage from './pageobjects/classes.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const lessonsPage = new LessonsPage();
const usersPage = new UsersPage();
const classesPage = new ClassesPage();

fixture(`Navigation tests`).page(testEnvironment.feUrl);

test('principle navigates to students (default) screen after login', async (t) => {
  await loginPage.loginAsPrinciple();
  await t.expect(studentPage._id().exists).ok();
});

test('principle can navigate to all pages from navbar', async (t) => {
  await loginPage.loginAsPrinciple();
  await navbar.navigateToStudentsPage();
  await t.expect(studentPage._id().exists).ok();
  await navbar.navigateToUsersPage();
  await t.expect(usersPage._id().exists).ok();
  await navbar.navigateToLessonsPage();
  await t.expect(lessonsPage._id().exists).ok();
  await navbar.navigateToClassesPage();
  await t.expect(classesPage._id().exists).ok();
});

test('principle can navigate to all pages by url', async (t) => {
  await loginPage.loginAsPrinciple();
  await navbar.navigateToStudentsPageByUrl();
  await t.expect(studentPage._id().exists).ok();
  await navbar.navigateToUsersPageByUrl();
  await t.expect(usersPage._id().exists).ok();
  await navbar.navigateToLessonsPageByUrl();
  await t.expect(lessonsPage._id().exists).ok();
  await navbar.navigateToClassesPageByUrl();
  await t.expect(classesPage._id().exists).ok();
});
