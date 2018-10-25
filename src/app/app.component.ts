import { Component } from '@angular/core';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('he');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('he');
  }
}
