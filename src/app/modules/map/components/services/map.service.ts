import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IndoorAtlasPaths } from '../models/map.model';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point, Feature } from 'geojson';
import { latLng, LatLng } from 'leaflet';
import { AllPathsResponse, MapFloorsResponse, POIsProps, MapPOIsResponse } from './map.service.models';

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

    getAllMapPOIs(): Observable<FeatureCollection<Point, POIsProps>> {
        return this.apollo.query<MapPOIsResponse>({
            query: gql`{
                    allMapPOIs{
                        name,
                        disabled,
                        position
                    }
                }
        `}).map((res) => ({
                type: 'FeatureCollection',
                features: res.data.allMapPOIs.map((point) => ({
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
                } as Feature<Point, POIsProps>)),
            } as FeatureCollection<Point, POIsProps>));
    }

    getMapPOIsInFloor(points: FeatureCollection<Point, POIsProps>, floor: number) {
        const features = points.features.filter((point) => point.properties.floor === floor);
        return {
            type: 'FeatureCollection',
            features,
        } as FeatureCollection<Point, POIsProps>;
    }
}
