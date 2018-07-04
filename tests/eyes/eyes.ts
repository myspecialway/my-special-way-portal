import { Eyes, ConsoleLogHandler } from 'eyes.images';
import * as fs from 'fs';
export class MyEyes  {
    // Initialize the eyes SDK and set your private API key.
    eyes = new Eyes();
    constructor() {
        this.eyes.setApiKey('O4GjwYs66106Ycj0xINUrtv3bwmtcoOP97bprJVCL04XFo110');
        this.eyes.setLogHandler(new ConsoleLogHandler(true));
        this.eyes.setOs('Windows 7');
    }

    checkImage(img: string, page: string) {
        this.eyes.open('Image test', 'Javascript screenshot test!', {width: 800, height: 600}).then( () => {
            fs.readFile(img, (err, data) => {
                if (err) {
                    throw err;
                } // Fail if the file can't be read.
                return this.eyes.checkImage(data, page);
            });
        }).then( () => {
            // End visual UI testing. Validate visual correctness.
            return this.eyes.close(false);
        },  () => {
            return this.eyes.abortIfNotClosed();
        },
    );

}
}
