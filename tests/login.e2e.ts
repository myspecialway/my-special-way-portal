import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
import { EyesDriver } from './eyes/eyes';

const loginPage = new LoginPage();
const eye = new EyesDriver();

const assertLoginFailure = async (t) => {
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).notContains('student');
};

const assertLoginSuccess = async (t) => {
  const location = await t.eval(() => window.location);
  await t.expect(location.pathname).contains('student');
};

fixture(`Login tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await eye.openEyes('login tests'); // t is not here?
  })
  .after(async (t) => {
    await eye.closeEyes();
  });

test('Successful login for principle', async (t) => {
  await loginPage.loginAsPrinciple();
  await assertLoginSuccess(t);
  await eye.look(t, 'Succesful login test');
});
test('Successful login for teacher', async (t) => {
  await loginPage.loginAsTeacher();
  await assertLoginSuccess(t);
  await eye.look(t, 'Succesful login test');
});
test('Failed login for student', async (t) => {
  await loginPage.loginAsStudent();
  await assertLoginFailure(t);
});

test('Failed login - wrong credentials', async (t) => {
  // wrong password
  await loginPage.login('teacher', 'wrong-password');
  await t.expect(loginPage.wrongCredentialsErr.exists).ok();
  await assertLoginFailure(t);
  // wrong username
  await loginPage.login('non-existing-user', 'Aa123456');
  await t.expect(loginPage.wrongCredentialsErr.exists).ok();
  await assertLoginFailure(t);
  // empty credentials
  await loginPage.clearLoginInputFields();
  await t
    .click(loginPage.loginButton)
    .expect(loginPage.emptyPasswordErr.exists)
    .ok()
    .expect(loginPage.emptyUsernameErr.exists)
    .ok();
  await assertLoginFailure(t);
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
