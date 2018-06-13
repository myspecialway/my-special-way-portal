import { Component, OnInit } from '@angular/core';
import { LatLng, latLng, polyline, Polyline } from 'leaflet';
import { DEFAULT_MAP_OPTIONS } from './map.config';
import { PATHS } from './paths.mock';
import { LineString, MultiLineString } from 'geojson';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    options = DEFAULT_MAP_OPTIONS;
    center: LatLng | undefined;
    currentFloor = 1;
    layers: Polyline<LineString | MultiLineString, any>[];
    availableFloors: number[];

    ngOnInit() {
        this.availableFloors = this.getAvailableFloors();
        this.calcLayers();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    getAvailableFloors() {
        return PATHS.nodes.reduce((floors, node) => {
            if (floors.indexOf(node.floor) === -1) {
                floors.push(node.floor);
            }
            return floors;
        }, [] as number[]).sort();
    }

    setFloor(floorNum: number) {
        this.currentFloor = floorNum;
        this.calcLayers();
    }

    calcLayers() {
        this.layers = PATHS.edges
            .filter((edge) => this.isEdgeInFloor(PATHS, edge, this.currentFloor))
            .map((edge) => polyline([
                latLng(PATHS.nodes[edge.begin].latitude, PATHS.nodes[edge.begin].longitude),
                latLng(PATHS.nodes[edge.end].latitude, PATHS.nodes[edge.end].longitude),
            ]));
    }

    private isEdgeInFloor(paths: typeof PATHS, edge: { begin: number; end: number; }, floor: number): boolean {
        return paths.nodes[edge.begin].floor === floor || paths.nodes[edge.end].floor === floor;
    }
}
