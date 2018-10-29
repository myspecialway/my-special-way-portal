import { Selector } from 'testcafe';
import { list } from 'postcss';

export default class LessonsPage {
  static url = '/lesson';
  _id: Selector;
  lessonsTable: Selector;
  lessonTableRow: Selector;
  lessonList: string[];

  constructor() {
    this._id = Selector('[data-test-id$="lessons-page"]');
    this.lessonsTable = Selector('.msw-table');
    this.lessonTableRow = Selector('.mat-row');
    this.lessonList = new Array();
  }

  async getLessonCount() {
    return (await this.lessonsTable.childElementCount) - 1; // remove the header
  }

  async getLessonList(lessonCount) {
    console.log(lessonCount * 3);

    let indexList = 0;
    for (let row = 1; row < lessonCount * 3; row++) {
      if (row % 3 === 0) {
        let myVar = Selector('.msw-table .mat-row .mat-cell').nth(row);
        this.lessonList[indexList] = await myVar.textContent;
        this.lessonList[indexList].trim();
        // console.log(this.lessonList[indexList]);
        indexList++;
      }
    }
    return this.lessonList;
  }
}
