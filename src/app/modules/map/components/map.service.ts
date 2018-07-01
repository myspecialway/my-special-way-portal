import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { IndoorAtlasPaths, IndoorAtlasEdge, IndoorAtlasNode } from './map.model';
import { Observable } from 'rxjs/Observable';

interface AllPathsResponse {
    allMapPathsNodes: IndoorAtlasNode[];
    allMapPathsEdges: IndoorAtlasEdge[];
}

interface MapFloorsResponse {
    allMapFloors: Array<{floor: number}>;
}

@Injectable()
export class MapService {
    constructor(private apollo: Apollo) { }

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
}
