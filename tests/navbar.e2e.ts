import { Selector } from 'testcafe';
import LoginPage from './pageobjects/login.po';
import * as r from './pageobjects/roles';
import NavbarPage from './pageobjects/navbar.po';
const loginPage = new LoginPage();
const navbar = new NavbarPage();

fixture(`Navbar tests`).page(`http://localhost:4200`)

.beforeEach( async (t) => {
    await t
    // .useRole(r.teacher)
    .typeText(loginPage.useranmeField, 'msw-teacher')
    .typeText(loginPage.passwordField, 'Aa123456')
    .click(loginPage.loginButton);
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
test('Navigate to Users', async (t) => {
    await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownUsers);
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('user');
});
test('Navigate to Students', async (t) => {
    await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownUsers)
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownStudents);
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('student');
});
test('Navigate to Classes', async (t) => {
    await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownClasses);
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('class');
});
test('displays username after login', async (t) => {
    await t.
    expect(navbar.username.exists).ok;
    await t.expect(navbar.username.innerText).contains('MSW-TEACHER');
});
test('does not display username after logout', async (t) => {
    await t.
    click(navbar.toolsDropDown).
    click(navbar.logoutMenuItem).
    expect(navbar.username.exists).notOk;
});
