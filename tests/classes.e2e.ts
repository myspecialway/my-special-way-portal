import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import { Selector, t } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();
const classesPage = new ClassesPage();

fixture(`Class tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
  });

function getDeleteClassButtonSelector(className: string) {
  return Selector(`[data-test-id=delete-class-button-${className}]`);
}

test('Principle can view all classes', async () => {
  await t.expect(classesPage.classNameCell.withExactText('טיטאן').exists).ok();
});

test('Principle can add, edit and delete a class', async () => {
  // If the class exists - delete it.
  while (await classesPage.classNameCell.withExactText('test').exists) {
    await t.click(getDeleteClassButtonSelector('test')).click(classesPage.confirmDeleteButton);
  }

  while (await classesPage.classNameCell.withExactText('editedClass').exists) {
    await t.click(getDeleteClassButtonSelector('editedClass')).click(classesPage.confirmDeleteButton);
  }

  //add a new class
  await t
    .click(classesPage.addClassButton)
    .expect(classDetailsPage._id.exists)
    .ok();
  const location = await t.eval(() => window.location);
  await t
    .expect(location.pathname)
    .contains('_new_')
    .typeText(classDetailsPage.classNameInput, 'test')
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption)
    .click(classDetailsPage.backToClassButton)
    //edit the class name
    .click(classesPage.classNameCell.withExactText('test'))
    .selectText(classDetailsPage.classNameInput)
    .pressKey('delete')
    .typeText(classDetailsPage.classNameInput, 'editedClass')
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.classNameCell.withExactText('editedClass').exists)
    .ok()
    // delete the class
    .click(getDeleteClassButtonSelector('editedClass'))
    .click(classesPage.deleteClassDialogDeleteButton)
    .expect(classesPage.classNameCell.withExactText('editedClass').exists)
    .notOk();
});
