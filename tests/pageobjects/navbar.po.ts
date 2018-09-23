import { Selector, t } from 'testcafe';

export default class NavbarPage {
  toolsDropDown: Selector;
  menuDropDown: Selector;
  logoutMenuItem: Selector;
  menuDropDownStudents: Selector;
  menuDropDownClasses: Selector;
  menuDropDownLessons: Selector;
  menuDropDownMap: Selector;
  menuDropDownUsers: Selector;
  username: Selector;
  url: string | null;
  constructor() {
    this.toolsDropDown = Selector('[id$="navbarDropdownMenuLink"]');
    this.menuDropDown = Selector('[id$="navbarDropdownMenuLink0"]');
    this.logoutMenuItem = Selector('[id$="logout"]');
    this.menuDropDownStudents = Selector('.nb-student');
    this.menuDropDownClasses = Selector('.nb-class');
    this.menuDropDownLessons = Selector('.nb-lesson');
    this.menuDropDownMap = Selector('.nb-map');
    this.menuDropDownUsers = Selector('.nb-user');
    this.username = Selector('.msw-header-user-name');
    this.url = null;
  }

  async navigateToStudentsPage() {
    await t.click(this.menuDropDown).click(this.menuDropDownStudents);
  }

  async navigateToUsersPage() {
    await t.click(this.menuDropDown).click(this.menuDropDownUsers);
  }

  async navigateToClassesPage() {
    await t.click(this.menuDropDown).click(this.menuDropDownClasses);
  }

  async navigateToLessonsPage() {
    await t.click(this.menuDropDown).click(this.menuDropDownLessons);
  }

  async navigateToStudentsPageByUrl() {
    await t.navigateTo('/student');
  }

  async navigateToUsersPageByUrl() {
    await t.navigateTo('/user');
  }

  async navigateToClassesPageByUrl() {
    await t.navigateTo('/class');
  }

  async navigateToLessonsPageByUrl() {
    await t.navigateTo('/lesson');
  }
}
