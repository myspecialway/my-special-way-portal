import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import * as _ from 'lodash';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();
const classesPage = new ClassesPage();

const newClassName = 'newClassTest';

const assertSchedulingDisabled = async (t) => {
  await t
    .click(classDetailsPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellDialogue.exists)
    .notOk();
};

const assertScheduleCellWithExactText = async (cellNumbers: number[], text: string, t) => {
  cellNumbers.map(async (cellNumber) => {
    const cell = classDetailsPage.scheduleCell.nth(cellNumber);
    await t.expect(cell.textContent).eql(text, `scheduled cell ${cellNumber} doesn't contain the text "${text}"`);
  });
};

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

test('Should inherit default schedule A-C grades', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ג'));
  await assertScheduleCellWithExactText(_.range(26, 31), 'ארוחת בוקר', t);
  await assertScheduleCellWithExactText(_.range(34, 39), 'הפסקה', t);
  await assertScheduleCellWithExactText(_.range(66, 71), 'ארוחת צהריים', t);
  await assertScheduleCellWithExactText(_.range(74, 79), 'הפסקה', t);
  await assertScheduleCellWithExactText(_.range(114, 119), 'פיזור תלמידים', t);
  await t.click(classDetailsPage.backToClassButton);
  await classesPage.deleteClass(newClassName); // cleaning...
});

test('Should inherit default schedule D-F grades', async (t) => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ד'));
  await assertScheduleCellWithExactText(_.range(26, 31), 'הפסקה', t);
  await assertScheduleCellWithExactText(_.range(34, 39), 'ארוחת בוקר', t);
  await assertScheduleCellWithExactText(_.range(66, 71), 'הפסקה', t);
  await assertScheduleCellWithExactText(_.range(74, 79), 'ארוחת צהריים', t);
  await assertScheduleCellWithExactText(_.range(114, 119), 'פיזור תלמידים', t);
  await t.click(classDetailsPage.backToClassButton);
  await classesPage.deleteClass(newClassName); // cleaning...
});

test('Should not be able to schedule before the class is created', async (t) => {
  await assertSchedulingDisabled(t);
  await t.typeText(classDetailsPage.classNameInput, newClassName);
  await assertSchedulingDisabled(t);
  await t.click(classDetailsPage.backToClassButton);
  await t.click(classesPage.addClassButton);
  await t.click(classDetailsPage.gradeSelect).click(classDetailsPage.gradeSelectOption);
  await assertSchedulingDisabled(t);
  await t.click(classDetailsPage.backToClassButton);
  await classesPage.deleteClass(newClassName); // cleaning...
});
