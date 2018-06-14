import { Component, OnInit } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { DEFAULT_MAP_OPTIONS } from './map.config';
import { PATHS } from './paths.mock';
import { IndoorAtlasPaths, LeafletPaths } from './map.model';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    options = DEFAULT_MAP_OPTIONS;
    center: LatLng | undefined;
    currentFloor = 1;
    layers: LeafletPaths;
    availableFloors: number[];
    indoorAtlasPaths: IndoorAtlasPaths = PATHS;

    ngOnInit() {
        this.availableFloors = this.getAvailableFloors();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
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
}
