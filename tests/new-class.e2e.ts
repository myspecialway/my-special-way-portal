import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import ClassesPage from './pageobjects/classes.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import StudentPage from './pageobjects/students.po';
import * as _ from 'lodash';
import { Selector, t } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const classDetailsPage = new ClassDetailsPage();
const classesPage = new ClassesPage();
const studentsPage = new StudentPage();

const newClassName = 'newClassTest';

const assertSchedulingDisabled = async () => {
  await t
    .click(studentsPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellDialogue.exists)
    .notOk();
};

const assertScheduleCellWithExactText = async (cellNumbers: number[], text: string) => {
  cellNumbers.map(async (cellNumber) => {
    const cell = studentsPage.scheduleEmptyCell.nth(cellNumber);
    await t.expect(cell.textContent).eql(text, `scheduled cell ${cellNumber} doesn't contain the text "${text}"`);
  });
};

fixture(`Class tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToClassesPage();
    await t.click(classesPage.addClassButton);
  });

async function deleteClass(className: string) {
  await t.click(getDeleteClassButtonSelector(className)).click(classesPage.deleteClassDialogDeleteButton);
}

function getDeleteClassButtonSelector(className: string) {
  return Selector(`[data-test-id=delete-class-button-${className}]`);
}

test('Should be able to create a class with name and grade', async () => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption)
    .click(classDetailsPage.backToClassButton)
    .expect(classesPage.classNameCell.withExactText(newClassName).exists)
    .ok();
  await deleteClass(newClassName); // cleaning...
});

test('Should inherit default schedule A-C grades', async () => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ג'));
  await assertScheduleCellWithExactText(_.range(26, 31), 'ארוחת בוקר');
  await assertScheduleCellWithExactText(_.range(34, 39), 'הפסקה');
  await assertScheduleCellWithExactText(_.range(66, 71), 'ארוחת צהריים');
  await assertScheduleCellWithExactText(_.range(74, 79), 'הפסקה');
  await assertScheduleCellWithExactText(_.range(114, 119), 'פיזור תלמידים');
  await t.click(classDetailsPage.backToClassButton);
  await deleteClass(newClassName); // cleaning...
});

test('Should inherit default schedule D-F grades', async () => {
  await t
    .typeText(classDetailsPage.classNameInput, newClassName)
    .click(classDetailsPage.gradeSelect)
    .click(classDetailsPage.gradeSelectOption.withExactText('ד'));
  await assertScheduleCellWithExactText(_.range(26, 31), 'הפסקה');
  await assertScheduleCellWithExactText(_.range(34, 39), 'ארוחת בוקר');
  await assertScheduleCellWithExactText(_.range(66, 71), 'הפסקה');
  await assertScheduleCellWithExactText(_.range(74, 79), 'ארוחת צהריים');
  await assertScheduleCellWithExactText(_.range(114, 119), 'פיזור תלמידים');
  await t.click(classDetailsPage.backToClassButton);
  await deleteClass(newClassName); // cleaning...
});

test('Should not be able to schedule before the class is created', async () => {
  await assertSchedulingDisabled();
  await t.typeText(classDetailsPage.classNameInput, newClassName);
  await assertSchedulingDisabled();
  await t.click(classDetailsPage.backToClassButton);
  await t.click(classesPage.addClassButton);
  await t.click(classDetailsPage.gradeSelect).click(classDetailsPage.gradeSelectOption);
  await assertSchedulingDisabled();
  await t.click(classDetailsPage.backToClassButton);
  await deleteClass(newClassName); // cleaning...
});
