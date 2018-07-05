import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';

import {
    MapComponent,
    PathsMapperPipe,
    MapService,
} from './components';

@NgModule({
    imports: [
        LeafletModule.forRoot(),
        LeafletDrawModule.forRoot(),
        CommonModule,
        MatRadioModule,
    ],
    declarations: [
        MapComponent,
        PathsMapperPipe,
    ],
    providers: [
        MapService,
    ],
})
export class MapModule {
}
