import { Selector, t } from 'testcafe';

export default class NavbarPage {
  toolsDropDown: Selector;
  menuDropDown: Selector;
  logoutMenuItem: Selector;
  menuDropDownStudents: Selector;
  menuDropDownClasses: Selector;
  menuDropDownLessons: Selector;
  menuDropDownClassSchedule: Selector;
  menuDropDownMap: Selector;
  menuDropDownUsers: Selector;
  username: Selector;
  pageTitle: Selector;
  url: string | null;
  constructor() {
    this.toolsDropDown = Selector('[id$="navbarDropdownMenuLink"]');
    this.menuDropDown = Selector('[id$="navbarDropdownMenuLink0"]');
    this.logoutMenuItem = Selector('[id$="logout"]');
    this.menuDropDownStudents = Selector('.nb-student');
    this.menuDropDownClasses = Selector('.nb-class');
    this.menuDropDownLessons = Selector('.nb-lesson');
    this.menuDropDownClassSchedule = Selector('.nb-class-schedule');
    this.menuDropDownMap = Selector('.nb-map');
    this.menuDropDownUsers = Selector('.nb-user');
    this.username = Selector('.msw-header-user-name');
    this.pageTitle = Selector('.msw-page-title').child('span');
    this.url = null;
  }

  async navigateToStudentsPage() {
    await this.navigateTo(this.menuDropDownStudents);
  }

  async navigateToMapPage() {
    await this.navigateTo(this.menuDropDownMap);
  }
  async navigateToUsersPage() {
    await this.navigateTo(this.menuDropDownUsers);
  }

  async navigateToClassesPage() {
    await this.navigateTo(this.menuDropDownClasses);
  }

  async navigateToLessonsPage() {
    await this.navigateTo(this.menuDropDownLessons);
  }

  async navigateToClassSchedulePage() {
    await this.navigateTo(this.menuDropDownClassSchedule);
  }

  async navigateTo(pageSelector: Selector) {
    await t
      .setTestSpeed(0.1)
      .click(this.menuDropDown)
      .click(pageSelector)
      .setTestSpeed(0.5);
  }
}
