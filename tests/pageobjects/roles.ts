import { Role } from 'testcafe';
import LoginPage from './login.po';

const loginPage = new LoginPage();

export const teacher = Role('http://localhost:4200/login', async (t) => {
    await t
        .typeText(loginPage.useranmeField, 'msw-teacher')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);
});

export const principle = Role('http://localhost:4200', async (t) => {
    await t
        .typeText(loginPage.useranmeField, 'msw-principle')
        .typeText(loginPage.passwordField, 'Aa123456')
        .click(loginPage.loginButton);
});
