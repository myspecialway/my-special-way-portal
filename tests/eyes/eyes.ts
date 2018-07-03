import { Eyes, ConsoleLogHandler } from 'eyes.images';

export class NavbarComponent  {
    // Initialize the eyes SDK and set your private API key.
    eyes = new Eyes();
    constructor() {
        this.eyes.setApiKey('O4GjwYs66106Ycj0xINUrtv3bwmtcoOP97bprJVCL04XFo110');
        this.eyes.setLogHandler(new ConsoleLogHandler(true));
        this.eyes.setOs('Windows 7');
    }

    checkImage(img) {
            return this.eyes.checkImage(img, 'Contact-us page');
    }

}
