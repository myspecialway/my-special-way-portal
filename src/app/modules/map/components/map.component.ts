import { Component, OnInit, ViewChild } from '@angular/core';
import { LatLng, latLng, Control, Draw, Marker, Polygon } from 'leaflet';
import { IndoorAtlasPaths, LeafletPaths } from '../components/map.model';
import { DEFAULT_MAP_OPTIONS, DRAW_OPTIONS } from '../components/map.config';
import { MapService } from './map.service';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { isMarkerInsidePolygon } from '../server/logic';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    @ViewChild(LeafletDirective) leafletDirective;

    options = DEFAULT_MAP_OPTIONS;
    drawOptions: Control.DrawConstructorOptions = DRAW_OPTIONS;
    center: LatLng | undefined;
    layers: LeafletPaths;
    currentFloor: number;
    availableFloors: number[];
    indoorAtlasPaths: IndoorAtlasPaths;

    constructor(mapService: MapService) {
        mapService.getAllPaths().subscribe((paths) => {
            this.indoorAtlasPaths = paths;
        });
        mapService.getAllAvailableFloors().subscribe((floors) => {
            this.availableFloors = floors;
            if (!this.currentFloor) {
                this.currentFloor = floors[0];
            }
        });
    }

    ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    onDrawReady() {
        this.leafletDirective.getMap().on(Draw.Event.CREATED, (event) => {
            if (event.layer instanceof Marker) {
                console.log((event.layer as Marker).getLatLng());
            }
            if (event.layer instanceof Polygon) {
                const latLangPoints = (event.layer as Polygon).getLatLngs()[0] as LatLng[];
                const pointsInside = this.indoorAtlasPaths.nodes
                                .filter((node) => node.floor === this.currentFloor)
                                .filter((node) => isMarkerInsidePolygon(new LatLng(node.latitude, node.longitude), latLangPoints));
                console.log('Points to cancel: ', pointsInside);
            }
        });
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
    }
}
