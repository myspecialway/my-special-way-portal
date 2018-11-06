import { Eyes } from 'eyes.images'; // ConsoleLogHandler
import * as readFilePromise from 'fs-readfile-promise';

export class EyesDriver {
  eyes = new Eyes();
  constructor() {
    this.eyes.setApiKey('4ZzDF102xhdjJa3012AJPueEC4BR0I7kcoCqVGbKjFXCk110');
  }

  async look(t, page: string) {
    if (process.env.CI) {
      await t.takeScreenshot(page.replace(/ /g, ''));
      try {
        const image = await readFilePromise(__dirname + '/screenshots/' + page.replace(/ /g, '') + '.png');
        await this.eyes.checkImage(image, page);
      } catch (error) {
        console.error(`e2etests:: eyes:: error reading screenshot ${error}`);
      }
    }
  }
  async openEyes(str) {
    await this.eyes.open('Image test', str, { width: 1000, height: 800 });
  }
  async closeEyes() {
    await this.eyes.close();
  }
}
