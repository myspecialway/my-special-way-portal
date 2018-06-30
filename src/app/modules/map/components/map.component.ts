import { Component, OnInit } from '@angular/core';
import { LatLng, latLng, Control } from 'leaflet';
import { IndoorAtlasPaths, LeafletPaths } from '../components/map.model';
// import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
// import { isMarkerInsidePolygon } from '../server/logic';

import { DEFAULT_MAP_OPTIONS, DRAW_OPTIONS } from '../components/map.config';
import { AVAILABLE_FLOORS } from '../server/floors.mock';
import { MapService } from './map.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    // @ViewChild(LeafletDirective) leafletDirective;

    options = DEFAULT_MAP_OPTIONS;
    center: LatLng | undefined;
    currentFloor = 2;
    layers: LeafletPaths;
    availableFloors: number[] = AVAILABLE_FLOORS;
    indoorAtlasPaths: Observable<IndoorAtlasPaths>; // = PATHS;
    indoorMap = [];
    drawOptions: Control.DrawConstructorOptions = DRAW_OPTIONS;

    constructor(mapService: MapService) {
        this.indoorAtlasPaths = mapService.getAllPaths();
    }

    ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    onDrawReady() {
        // this.leafletDirective.getMap().on(Draw.Event.CREATED, (event) => {
        //     if (event.layer instanceof Marker) {
        //         console.log((event.layer as Marker).getLatLng());
        //     }
        //     if (event.layer instanceof Polygon) {
        //         const latLangPoints = (event.layer as Polygon).getLatLngs()[0] as LatLng[];
        //         const pointsInside = this.indoorAtlasPaths.nodes
        //                         .filter((node) => node.floor === this.currentFloor)
        //                         .filter((node) => isMarkerInsidePolygon(new LatLng(node.latitude, node.longitude), latLangPoints));
        //         console.log('Points to cancel: ', pointsInside);
        //     }
        // });
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
    }
}
