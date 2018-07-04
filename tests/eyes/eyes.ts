import { Eyes, ConsoleLogHandler } from 'eyes.images';
import * as readFilePromise from 'fs-readfile-promise';

export class MyEyes  {

    eyes = new Eyes();
    constructor() {
            this.eyes.setApiKey('O4GjwYs66106Ycj0xINUrtv3bwmtcoOP97bprJVCL04XFo110');
            this.eyes.setLogHandler(new ConsoleLogHandler(true));
            this.eyes.setOs('Windows 7');
        }

    checkImage(img: string, page: string) {
        return this.eyes.open('Image test', 'Javascript screenshot test!', {width: 800, height: 600})
        .then( () => {
            return readFilePromise(img);
        }).then( (image) => {
            return this.eyes.checkImage(image, 'Google Logo');
        }).then(() => {
            return this.eyes.close();
        }).catch( (reason) => {
            console.error(reason);
        });

    }
}
