import { Component, OnInit } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { IndoorAtlasPaths, LeafletPaths } from '../components/map.model';
import { DEFAULT_MAP_OPTIONS, WAYPOINTS_LAYER } from '../components/map.config';
import { MapService } from './map.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    options = DEFAULT_MAP_OPTIONS;
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
        mapService.getAllMapWayPoints().subscribe((waypoints) => {
            WAYPOINTS_LAYER.addData(waypoints);
        });
    }

    ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
    }
}
