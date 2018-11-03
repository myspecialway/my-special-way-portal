import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DictionaryService {
  constructor(private translate: TranslateService) {}
  generateDictionary(objectWithKeys, options?: { ns?: string }) {
    let keys = Object.keys(objectWithKeys);
    if (options && options.ns) {
      keys = keys.map((key) => `${options.ns}.${key}`);
    }

    return new Promise((resolve, reject) => {
      const dictionary: any = {};
      this.translate.get(keys).subscribe((strings) => {
        if (options && options.ns) {
          keys.forEach((key: string) => {
            dictionary[key.replace(`${options.ns}.`, '')] = strings[key];
          });
        } else {
          keys.forEach((key: string) => {
            dictionary[key] = strings[key];
          });
        }

        resolve(dictionary);
      });
    });
  }
}
