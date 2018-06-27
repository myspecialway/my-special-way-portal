import { Selector } from 'testcafe';
import LoginPage from './pageobjects/login.po';

const loginPage = new LoginPage();

fixture(`Login tests`).page(`http://localhost:4200`);

test('Successful login test', async (t) => {
    await t
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
}); // ?returnUrl=%2Fclass
test('Successful login and deeplink', async (t) => {
    await t
        .navigateTo('http://localhost:4200/login?returnUrl=%2Fclass')
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);
    const location = await t.eval(() => window.location);

    await t.expect(location.pathname).notContains('login');
});
