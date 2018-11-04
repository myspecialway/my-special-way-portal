import LoginPage from './pageobjects/login.po';
import NavbarPage from './pageobjects/navbar.po';
import { testEnvironment } from './config/config';
import StudentPage from './pageobjects/students.po';
import ClassDetailsPage from './pageobjects/class-details.po';
import { Triggers } from 'eyes.sdk';
import LessonsPage from './pageobjects/lessons.po';
import { Selector } from 'testcafe';

const loginPage = new LoginPage();
const navbar = new NavbarPage();
const studentPage = new StudentPage();
const classDetailsPage = new ClassDetailsPage();
const lessonPage = new LessonsPage();

const createNewScheduleCell = async (t) => {
  await t
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.lessonOption)
    .click(classDetailsPage.editCellLocation)
    .click(classDetailsPage.locationOption);
};
const getLessonListFromSchedule = async (t) => {
  await t.pressKey('enter');
  await t.pressKey('down').setTestSpeed(0.1);
  await t.pressKey('enter');

  for (let row = 1; row <= (await Selector('.mat-select-content').childElementCount) - 1; row++) {
    studentPage.scheduleLessonList[row - 1] = await studentPage.scheduleCellLesson.nth(row).textContent;
    studentPage.scheduleLessonList[row - 1].trim();
  }
  return studentPage.scheduleLessonList;
};

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

test('update button enabled when fill-in location and lesson', async (t) => {
  await t
    .expect(studentPage.scheduleEmptyCell.textContent)
    .contains('add')
    .click(studentPage.scheduleEmptyCell)
    .click(classDetailsPage.editCellLesson)
    .click(classDetailsPage.editCellLocation)
    .expect(classDetailsPage.editCellUpdateButton.hasAttribute('disabled'))
    .notOk();
});

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
});

test('on a cell opened verify header displays correct title', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);
  await t.click(classDetailsPage.editCellLocation);

  await t.expect(await studentPage.getScheduleSlotHeader()).contains('עדכון מערכת שעות');
});

test('on a cell opened verify header displays correct timeframe', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);

  await t
    .expect(await studentPage.getSelectedSlotHour())
    .contains(await studentPage.getScheduleTableHourValue(studentPage.currentRowNumber));
});

test('on a cell opened verify lesson alert message', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);
  await t.click(classDetailsPage.editCellLesson);
  await t.pressKey('esc');
  await t.expect(studentPage.errors.textContent).contains('חובה לבחור שיעור');
  await t.expect(studentPage.errors.getStyleProperty('color')).eql('rgb(244, 67, 54)');
});

test('on a cell opened verify location alert message', async (t) => {
  await t.click(studentPage.scheduleEmptyCell);
  await t.click(classDetailsPage.editCellLocation);
  await t.pressKey('esc');
  await t.expect(await studentPage.errors.nth(1).textContent).contains('חובה לבחור מיקום');
  await t.expect(await studentPage.errors.nth(1).getStyleProperty('color')).eql('rgb(244, 67, 54)');
});

test('on a cell opened verify all Lessons Displayed In List', async (t) => {
  // get lesson list from lesson page

  await navbar.navigateToLessonsPage();
  const lessonCount = await lessonPage.getLessonCount();
  await lessonPage.getLessonList(lessonCount);
  // on new student cell verify correct lesson list

  await navbar.navigateToStudentsPage();
  await studentPage.navigateToScheduleTab();
  await t.click(studentPage.scheduleEmptyCell);
  await t.click(classDetailsPage.editCellLesson);
  const count = await Selector('.mat-select-content').childElementCount;

  await t.expect(count).eql(lessonCount);
  await getLessonListFromSchedule(t);

  for (let row = 0; row <= studentPage.scheduleLessonList.length - 1; row++) {
    console.log(studentPage.scheduleLessonList[row] + '   ' + lessonPage.lessonList[row]);

    await t.expect(studentPage.scheduleLessonList[row].includes(lessonPage.lessonList[row]));
  }
});
