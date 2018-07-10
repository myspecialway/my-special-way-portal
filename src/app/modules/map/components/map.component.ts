import { Component, OnInit } from '@angular/core';
import { LatLng } from 'leaflet';
import { IndoorAtlasPaths } from './models/map.model';
import { defaultMapOptions, pointsOfInterestLayer } from './map.config';
import { MapService, POIsProps } from './services';
import { FeatureCollection, Point } from 'geojson';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    options = defaultMapOptions;
    center: LatLng | undefined;
    currentFloor: number;
    availableFloors: number[];
    indoorAtlasPaths: IndoorAtlasPaths;
    points: FeatureCollection<Point, POIsProps>;

    constructor(private mapService: MapService) {
        mapService.getAllPaths().subscribe((paths) => {
            this.indoorAtlasPaths = paths;
        });
        mapService.getAllAvailableFloors().subscribe((floors) => {
            this.availableFloors = floors;
            if (!this.currentFloor) {
                this.currentFloor = floors[0];
                this.updatePOIs();
            }
        });
        mapService.getAllMapPOIs().subscribe((points) => {
            this.points = points;
            this.updatePOIs();
        });
    }

    async ngOnInit() {
        this.center = await this.mapService.getCurrentPosition();
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
        this.updatePOIs();
    }

    private updatePOIs() {
        if (!this.points) {
            return;
        }
        pointsOfInterestLayer.clearLayers();
        pointsOfInterestLayer.addData(this.mapService.getMapPOIsInFloor(this.points, this.currentFloor));
    }
}
