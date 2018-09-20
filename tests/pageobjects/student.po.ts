import { Selector } from 'testcafe';

export default class StudentPage {
    newStudentButton: Selector;
    saveButton: Selector;
    firstName: Selector;
    lastName: Selector;
    username: Selector;
    classId: Selector;
    password: Selector;
    firstNameErr: Selector;
    lastNameErr: Selector;
    usernameErr: Selector;
    usernameFormatErr: Selector;
    classIdErr: Selector;
    passwordErr: Selector;
  constructor() {
        this.newStudentButton = Selector('[data-test-id$="new-student-button"]');
        this.saveButton = Selector('[data-test-id$="save-button"]');
        this.username = Selector('[name$="username"]');
        this.firstName = Selector('[name$="firstname"]');
        this.lastName = Selector('[name$="lastname"]');
        this.classId = Selector('[name$="class_id"]');
        this.password = Selector('[name$="password"]');
        this.usernameErr = Selector('[id$="username-err"]');
        this.usernameFormatErr = Selector('[id$="username-format-err"]');
        this.firstNameErr = Selector('[data-test-id$="firstname-err"]');
        this.lastNameErr = Selector('[data-test-id$="lastname-err"]');
        this.classIdErr = Selector('[data-test-id$="class-id-err"]');
        this.passwordErr = Selector('[data-test-id$="password-err"]');

  }
}
