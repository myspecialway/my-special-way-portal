import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import UsersPage from './pageobjects/users.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const usersPage = new UsersPage();

fixture(`Users tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToUsersPage();
    await usersPage.createNewUser();
  });

test('verify text appear on the delete dialog', async (t) => {
  const errMsg = ' האם אתה בטוח שברצונך למחוק את המשתמש TestUser TestUser? ';

  // await navbar.navigateToUsersPage();
  await t.hover(usersPage.userNameSelector);
  await t.click(usersPage.userDeleteButton.nth(await usersPage.getRowNumber()));
  await t.expect(usersPage.userDeleteErr.textContent).eql(errMsg);
});
