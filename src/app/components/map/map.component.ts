import { Component, OnInit } from '@angular/core';
import { LatLng, latLng, polyline } from 'leaflet';
import { DEFAULT_MAP_OPTIONS } from './map.config';
import { PATHS } from './paths.mock';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    options = DEFAULT_MAP_OPTIONS;
    center: LatLng | undefined;
    currentFloor = 1;
    layers = PATHS.edges
        .filter((edge) => this.isEdgeInFloor(PATHS, edge, this.currentFloor))
        .map((edge) => polyline([
                latLng(PATHS.nodes[edge.begin].latitude, PATHS.nodes[edge.begin].longitude),
                latLng(PATHS.nodes[edge.end].latitude, PATHS.nodes[edge.end].longitude),
            ]));

    ngOnInit() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.center = latLng(position.coords.latitude, position.coords.longitude);
            });
        }
    }

    private isEdgeInFloor(paths: typeof PATHS, edge: { begin: number; end: number; }, floor: number): boolean {
        return paths.nodes[edge.begin].floor === floor || paths.nodes[edge.end].floor === floor;
    }
}
