import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

export class TranslateCustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang === 'ru') {
      const ru = readJSON('assets/i18n/ru.json');
      return of(ru);
    }
    const en = readJSON('assets/i18n/en.json');

    return of(en);
  }
}

function readJSON(file) {
  return {};
}
