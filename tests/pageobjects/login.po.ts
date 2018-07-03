import { Selector } from 'testcafe';

export default class LoginPage {
    useranmeField: Selector;
    passwordField: Selector;
    loginButton: Selector;
    url: string;
    constructor() {
        this.useranmeField = Selector('[name$="username"]');
        this.passwordField = Selector('[name$="password"]');
        this.loginButton = Selector('.mat-button');
        this.url = '/login';
    }
}
