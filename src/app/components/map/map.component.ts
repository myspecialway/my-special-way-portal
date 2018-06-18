import { Component, OnInit, ViewChild } from '@angular/core';
import { LatLng, latLng, icon, DivIcon, Point, Control, Draw, Polygon, Marker, imageOverlay } from 'leaflet';
import { DEFAULT_MAP_OPTIONS, MAP_IMAGE_PLACEMENT } from './map.config';
import { PATHS } from './paths.mock';
import { IndoorAtlasPaths, LeafletPaths } from './map.model';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
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
    availableFloors: number[];
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
        }
    };

    ngOnInit() {
        this.availableFloors = this.getAvailableFloors();
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
                                .filter(node => node.floor === this.currentFloor)
                                .filter(node => this.isMarkerInsidePolygon(new LatLng(node.latitude, node.longitude), latLangPoints));
                console.log('Points to cancel: ', pointsInside);
            }
        });
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
    }

    private getAvailableFloors() {
        return PATHS.nodes.reduce((floors, node) => {
            if (floors.indexOf(node.floor) === -1) {
                floors.push(node.floor);
            }
            return floors;
        }, [] as number[]).sort();
    }

    /*
        Based on Ray Casting algorithm
        Source: https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
    */
    private isMarkerInsidePolygon(marker: LatLng, polyPoints: LatLng[]) {
        const x = marker.lat, y = marker.lng;
        let inside = false;
        for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            const xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            const xj = polyPoints[j].lat, yj = polyPoints[j].lng;
            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
}
