import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import { EyesDriver } from './eyes/eyes';
import StudentPage from './pageobjects/students.po';
import UsersPage from './pageobjects/users.po';
import LessonsPage from './pageobjects/lessons.po';
import ClassesPage from './pageobjects/classes.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const eye = new EyesDriver();

fixture(`Navbar tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await eye.openEyes('Navbar tests');
  })
  .after(async (t) => {
    await eye.closeEyes();
  })
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
  });

test('Successful logout test', async (t) => {
  await t
    // .useRole(r.teacher) did not work for me :(
    .maximizeWindow()
    .click(navbar.toolsDropDown)
    .click(navbar.logoutMenuItem);
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('login');
});
test('Successful navigation to students from nav menu', async (t) => {
  await t.click(navbar.menuDropDown).click(navbar.menuDropDownStudents);
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('student');
  await eye.look(t, 'Navigate to Students');
});
test('Successful navigation from students to classes', async (t) => {
  await t.click(navbar.menuDropDown).click(navbar.menuDropDownClasses);
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('class');
  await eye.look(t, 'Navigate to Classes');
});
test('Navigate to Classes', async (t) => {
  await t.click(navbar.menuDropDown).click(navbar.menuDropDownClasses);
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('class');
  await eye.look(t, 'Navigate to Classes');
});
test('does not display username after logout', async (t) => {
  await t
    .click(navbar.toolsDropDown)
    .click(navbar.logoutMenuItem)
    .expect(navbar.username.exists).notOk;
});
test('page titles match actual page', async (t) => {
  //by URL
  await t
    .navigateTo(StudentPage.url)
    .expect(navbar.pageTitle().innerText)
    .eql('ניהול תלמידים')
    .navigateTo(UsersPage.url)
    .expect(navbar.pageTitle().innerText)
    .eql('ניהול משתמשים')
    .navigateTo(LessonsPage.url)
    .expect(navbar.pageTitle().innerText)
    .eql('ניהול שיעורים')
    .navigateTo(ClassesPage.url)
    .expect(navbar.pageTitle().innerText)
    .eql('ניהול כיתות');

  // from navbar
  await navbar.navigateToStudentsPage();
  await t.expect(navbar.pageTitle().innerText).eql('ניהול תלמידים');
  await navbar.navigateToUsersPage();
  await t.expect(navbar.pageTitle().innerText).eql('ניהול משתמשים');
  await navbar.navigateToLessonsPage();
  await t.expect(navbar.pageTitle().innerText).eql('ניהול שיעורים');
  await navbar.navigateToClassesPage();
  await t.expect(navbar.pageTitle().innerText).eql('ניהול כיתות');
});
