// import { Selector } from 'testcafe';
import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
import { MyEyes } from './eyes/eyes';
const loginPage = new LoginPage();
const eye = new MyEyes();
fixture(`Login tests`).page(testEnvironment.feUrl);

test.only('Successful login test', async (t) => {
    await t
        .maximizeWindow()
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);

    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('student');
    await t.takeScreenshot('login');
    await eye.checkImage('C:\\Users\\dk080e\\eclipse-workspace\\my-special-way-portal\\screenshots\\login.png', 'login');
});
test('Failed login test', async (t) => {
    await t
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, '11')
        .click(loginPage.loginButton);
    const location = await t.eval(() => window.location);

    await t.expect(location.pathname).notContains('student');
});
test('Successful login and deeplink', async (t) => {
    await t
        .navigateTo(testEnvironment.feUrl + '/login?returnUrl=%2Fclass')
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);
    const location = await t.eval(() => window.location);

    await t.expect(location.pathname).notContains('login');
});
