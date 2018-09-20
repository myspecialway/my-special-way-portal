import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
import { EyesDriver } from './eyes/eyes';

const loginPage = new LoginPage();
const eye = new EyesDriver();

fixture(`Login tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await eye.openEyes('login tests'); // t is not here?
  })
  .after(async (t) => {
    await eye.closeEyes();
  });

test('Successful login test', async (t) => {
  await t
    .maximizeWindow()
    .typeText(loginPage.useranmeField, 'principle')
    .typeText(loginPage.passwordField, 'Aa123456')
    .click(loginPage.loginButton);

  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('student');
  await eye.look(t, 'Succesful login test');
});
test('Failed login test', async (t) => {
  await t
    .typeText(loginPage.useranmeField, 'msw-teacher')
    .typeText(loginPage.passwordField, '11')
    .click(loginPage.loginButton);
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).notContains('student');
  // await t.takeScreenshot('login');
  await eye.look(t, 'Failed login test');
});
// TODO: config ngnix to support deep linking
// test('Successful login and deeplink', async (t) => {
//     await t
//         .navigateTo(testEnvironment.feUrl + '/login?returnUrl=%2Fclass')
//         .typeText(loginPage.useranmeField, 'msw-teacher')
//         .typeText(loginPage.passwordField, 'Aa123456')
//         .click(loginPage.loginButton);
//     const location = await t.eval(() => window.location);
//     await t.expect(location.pathname).notContains('login');
//     await eye.look(t, 'Successful login and deeplink');
// });
