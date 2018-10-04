import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (typeof MSW_HOT_CONFIG !== 'undefined' && MSW_HOT_CONFIG) {
  environment.hotConfig = MSW_HOT_CONFIG;
}
if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.log(err));
