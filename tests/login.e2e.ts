// import { Selector } from 'testcafe';
import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
const loginPage = new LoginPage();

fixture(`Login tests`).page(testEnvironment.feUrl);

test('Successful login test', async (t) => {
    await t
        .maximizeWindow()
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);

    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('student');
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
