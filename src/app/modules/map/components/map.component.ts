import { Component, OnInit, ViewChild } from '@angular/core';
import { LatLng, latLng, DivIcon, Point, Control, Draw, Polygon, Marker } from 'leaflet';
import { IndoorAtlasPaths, LeafletPaths } from '../components/map.model';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { isMarkerInsidePolygon } from '../server/logic';

import { DEFAULT_MAP_OPTIONS } from '../components/map.config';
import { AVAILABLE_FLOORS } from '../server/floors.mock';
import { PATHS } from '../server/paths.mock';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    @ViewChild(LeafletDirective) leafletDirective;

    options = DEFAULT_MAP_OPTIONS;
    center: LatLng | undefined;
    currentFloor = 2;
    layers: LeafletPaths;
    availableFloors: number[] = AVAILABLE_FLOORS;
    indoorAtlasPaths: IndoorAtlasPaths = PATHS;
    indoorMap = [];

    drawOptions: Control.DrawConstructorOptions = {
        position: 'topright',
        draw: {
            polyline: false,
            circle: false,
            polygon: {
                icon: new DivIcon({
                    iconSize: new Point(16, 16),
                    className: 'leaflet-div-icon leaflet-editing-icon my-beautiful-icon',
                }),
            },
        },
    };

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
