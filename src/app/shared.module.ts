import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DictionaryService } from './services/language/dictionary.service';

import { AuthGuard } from './services/authentication/auth.guard';

@NgModule({
  imports: [TranslateModule.forChild()],
  declarations: [],
  providers: [TranslateService, DictionaryService],
  exports: [TranslateModule],
})
export class SharedModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('he');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('he');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthGuard],
    };
  }
}
