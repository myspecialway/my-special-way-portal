import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IndoorAtlasPaths, IndoorAtlasEdge, IndoorAtlasNode } from './map.model';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point, Feature } from 'geojson';
import { latLng, LatLng } from 'leaflet';

interface AllPathsResponse {
    allMapPathsNodes: IndoorAtlasNode[];
    allMapPathsEdges: IndoorAtlasEdge[];
}

interface MapFloorsResponse {
    allMapFloors: Array<{floor: number}>;
}

interface MapWayPoint {
    name: string;
        disabled: boolean;
        position: { latitude: number, longitude: number, floor: number };
}
interface MapWayPointsResponse {
    allMapWayPoints: MapWayPoint[];
}
export interface WaypointsProps {
    name: string;
    disabled: boolean;
    floor: number;
}

@Injectable()
export class MapService {
    constructor(private apollo: Apollo) { }

    getCurrentPosition(): Promise<LatLng | undefined> {
        return new Promise((resolve) => {
            if (!window.navigator.geolocation) {
                resolve();
                return;
            }
            window.navigator.geolocation.getCurrentPosition((position) => {
                resolve(latLng(position.coords.latitude, position.coords.longitude));
            });
        });
    }

    getAllPaths(): Observable<IndoorAtlasPaths> {
        return this.apollo.query<AllPathsResponse>({
            query: gql`{
                    allMapPathsNodes{
                        latitude,
                        longitude,
                        floor
                    }
                    allMapPathsEdges {
                        begin,
                        end
                    }
                }
        `}).map((res) => ({
                nodes: res.data.allMapPathsNodes,
                edges: res.data.allMapPathsEdges,
            }));
    }

    getAllAvailableFloors(): Observable<number[]> {
        return this.apollo.query<MapFloorsResponse>({
            query: gql`{
                    allMapFloors{
                        floor
                    }
                }
        `}).map((res) => (res.data.allMapFloors.map((item) => item.floor)));
    }

    getAllMapWayPoints(): Observable<FeatureCollection<Point, WaypointsProps>> {
        return this.apollo.query<MapWayPointsResponse>({
            query: gql`{
                    allMapWayPoints{
                        name,
                        disabled,
                        position
                    }
                }
        `}).map((res) => ({
                type: 'FeatureCollection',
                features: res.data.allMapWayPoints.map((point) => ({
                    type: 'Feature',
                    properties: {
                        name: point.name,
                        disabled: point.disabled,
                        floor: point.position.floor,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [point.position.longitude, point.position.latitude],
                    } as Point,
                } as Feature<Point, WaypointsProps>)),
            } as FeatureCollection<Point, WaypointsProps>));
    }

    getMapWayPointsInFloor(waypoints: FeatureCollection<Point, WaypointsProps>, floor: number) {
        const features = waypoints.features.filter((point) => point.properties.floor === floor);
        return {
            type: 'FeatureCollection',
            features,
        } as FeatureCollection<Point, WaypointsProps>;
    }
}
