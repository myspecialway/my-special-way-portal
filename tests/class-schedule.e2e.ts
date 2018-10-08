import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassDetailsPage from './pageobjects/class-details.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();

fixture(`Class schedule tests`).page(testEnvironment.feUrl);

test('Class name, grade and back-to-classes button should not be visible', async (t) => {
  await loginPage.loginAsTeacher();
  await navbar.navigateToClassSchedulePage();
  await t
    .expect(classDetailsPage.classNameInput.exists)
    .notOk()
    .expect(classDetailsPage.gradeSelect.exists)
    .notOk()
    .expect(classDetailsPage.backToClassButton.exists)
    .notOk();
});
