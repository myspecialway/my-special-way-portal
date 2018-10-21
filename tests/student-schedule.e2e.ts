import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage, { default as StudentsPage } from './pageobjects/students.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import { Selector } from 'testcafe';
// todo change before and after

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const classDetailsPage = new ClassDetailsPage();

const createNewScheduleCell = async (t) => {
  await t
    // .expect(studentPage.scheduleEmptyCell.textContent)
    // .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.lessonOption)
    .click(classDetailsPage.editCellLocation)
    .click(classDetailsPage.locationOption);
};

const getTable = async (t) => {
  const container = await Selector('table');
  console.log('container.childElementCount:', container.childElementCount);

  await t
    // .expect('table').childElementCount
    // .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.lessonOption)
    .click(classDetailsPage.editCellLocation)
    .click(classDetailsPage.locationOption);
};
//
//

fixture(`Student Schedule tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async (t) => {
    await loginPage.loginAsPrinciple();
    await navbar.navigateToStudentsPage;
    await studentPage.createNewScheduleTestUser();
    await studentPage.navigateToScheduleTab();
    await studentPage.findEmptyCell(await studentPage.getStudentScheduleTableRowsNumber());
  });

test('should open popup on click on empty cell', async (t) => {
  // console.log('final row ' + this.currentRowNumber + ' final col ' + this.currentColumnNumber);
  await t.click(studentPage.scheduleEmptyCell);
  await t.expect(classDetailsPage.editCellDialogue.exists).ok();
});

test('should update existing cell,should create lesson+location on empty cell', async (t) => {
  await createNewScheduleCell(t);
  await t.click(classDetailsPage.editCellUpdateButton);
  await t.expect(studentPage.scheduleEmptyCell.textContent).contains('אומנות0 מעלית קומה');
  await t.expect(studentPage.scheduleEmptyCell.textContent).notContains('add');
});

test('should be able to discard changes inside popup', async (t) => {
  await createNewScheduleCell(t);
  await t.click(classDetailsPage.editCellCloseButton);
  await t.expect(studentPage.scheduleEmptyCell.textContent).notContains('אומנות0 מעלית קומה');
  await t.expect(studentPage.scheduleEmptyCell.textContent).contains('add');
});

test('should display correct time frame on the new schedule cell displayed', async (t) => {
  // await createNewScheduleCell(t);
  // await t.expect(classDetailsPage.timeSlotInfoOnStudentSchedule).contains("");
  //
  // await t.click(classDetailsPage.editCellCloseButton);
  // await t.expect(classDetailsPage.scheduleEmptyCell.textContent).notContains('אומנות0 מעלית קומה');
  // await t.expect(classDetailsPage.scheduleEmptyCell.textContent).contains('add');
});

// verify update button state

test('update button disabled when location/subject is empty', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .ok();
});
/**
 * submit button of update schedule in different states
 */
test('update button disabled when subject is empty', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .ok();
});

test('update button disabled when location is empty', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLocation)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .ok();
});

test('update button disabled when open the schedule dialog ', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .ok();
});

// test('update button enabled when fill-in location and lesson', async (t) => {
//   await t
//     .expect(studentPage.scheduleEmptyCell.textContent)
//     .contains('add')
//     .click(studentPage.scheduleEmptyCell)
//     .click(classDetailsPage.editCellLesson)
//     .click(classDetailsPage.editCellLocation)
//     .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled')).notOk();
// });

test('update button enabled when fill-in location and lesson', async (t) => {
  await t
    .click(studentPage.scheduleEmptyCell)
    .doubleClick(classDetailsPage.editCellLesson)
    .doubleClick(classDetailsPage.editCellLocation)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .notOk();
});

/**
 * close button of update schedule in different states
 */
test('close button enabled when subject is empty', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .expect(classDetailsPage.editCellCloseButton.hasAttribute('disabled'))
    .notOk();
});

test('close button enabled when location is empty', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLocation)
    .expect(classDetailsPage.editCellCloseButton.hasAttribute('disabled'))
    .notOk();
});

test('close button enabled when just open the update schedule dialog', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .expect(classDetailsPage.editCellCloseButton.hasAttribute('disabled'))
    .notOk();
});

test('on a cell opened verify the day displayed on the header equals to day from schedule table.', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);

  await t
    .expect(await studentPage.getSelectedSlotDayValue())
    .contains(await studentPage.getScheduleTableDayValue(studentPage.currentColumnNumber));
  // .expect(await studentPage.getScheduleTableDayValue(studentPage.currentColumnNumber)).contains(studentPage.getSelectedSlotDayValue);
});

test('on a cell opened verify header displays correct title', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);
  await t.expect(await studentPage.getSelectedSlotHeader()).contains('עדכון מערכת שעות');
});

test('on a cell opened verify header displays correct timeframe', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);

  await t
    .expect(await studentPage.getSelectedSlotHour())
    .contains(await studentPage.getScheduleTableHourValue(studentPage.currentRowNumber));
});
