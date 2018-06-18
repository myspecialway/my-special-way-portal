import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { AppComponent } from './app.component';
import {
  MapComponent,
  PathsMapperPipe,
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PathsMapperPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule.forRoot(), // later move this into map module
    LeafletDrawModule.forRoot(), // later move this into map module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
