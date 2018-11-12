import LoginPage from './pageobjects/login.po';
import UsersPage from './pageobjects/users.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import { EyesDriver } from './eyes/eyes';

const loginPage = new LoginPage();
const usersPage = new UsersPage();
const navbar = new NavbarPage();
const eye = new EyesDriver();

fixture(`Users tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await eye.openEyes('users tests'); // t is not here?
  })
  .after(async (t) => {
    await eye.closeEyes();
  })
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
  });

test('Successful navigation to users', async (t) => {
  await navbar.navigateToUsersPage();
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('user');
  await eye.look(t, 'Navigate to Users');
});

test('Create new user and delete it - success', async (t) => {
  await navbar.navigateToUsersPage();
  await usersPage.createNewUserTestUser();
  await usersPage.deleteExistingUserTestUser();
});

test('Create new user - verify error messages when missing details', async (t) => {
  await navbar.navigateToUsersPage();
  await usersPage.testMissingDetailsTestUser();
});
