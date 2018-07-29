import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import {testEnvironment} from './config/config';
import { EyesDriver } from './eyes/eyes';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const eye = new EyesDriver();

fixture(`Navbar tests`).page(testEnvironment.feUrl)
.before(async (t) => {
    await eye.openEyes('Navbar tests');
})
.after(async (t) => {
    await eye.closeEyes();
})
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
    await eye.look(t, 'Navigate to Users');
});
test('Navigate to Students', async (t) => {
    await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownUsers)
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownStudents);
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('student');
    await eye.look(t, 'Navigate to Students');
});
test('Navigate to Classes', async (t) => {
    await t
    .click(navbar.menuDropDown)
    .click(navbar.menuDropDownClasses);
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname).contains('class');
    await eye.look(t, 'Navigate to Classes');
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
