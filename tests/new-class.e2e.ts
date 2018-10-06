import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();
const classesPage = new ClassesPage();

const newClassName = 'newClassTest';

fixture(`Class tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await t.click(classesPage.addClassButton);
  });

test('Should be able to create a class with name and grade', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption)
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.classNameCell.withExactText(newClassName).exists)
    .ok();
  await classesPage.deleteClass(newClassName); // cleaning...
});

test('should inherit default schedule A-C grades', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ג'))
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.classNameCell.withExactText(newClassName).exists)
    .ok();
  await classesPage.deleteClass(newClassName); // cleaning...
});

test('should inherit default schedule D-F grades', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ד'))
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.classNameCell.withExactText(newClassName).exists)
    .ok();
  await classesPage.deleteClass(newClassName); // cleaning...
});

test('should not be able to schedule before the class is created', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption)

    .click(classDetailsPage.backToClassButton);
  await classesPage.deleteClass(newClassName); // cleaning...
});
