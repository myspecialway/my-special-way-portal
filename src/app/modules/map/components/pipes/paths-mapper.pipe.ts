import { Pipe, PipeTransform } from '@angular/core';
import { polyline, latLng } from 'leaflet';
import { IndoorAtlasPaths, LeafletPaths, IndoorAtlasEdge } from '../models/map.model';

@Pipe({ name: 'pathsMapper' })
export class PathsMapperPipe implements PipeTransform {
  transform(paths: IndoorAtlasPaths, currentFloor: number): LeafletPaths | undefined {
    if (!paths) {
      return;
    }
    return paths.edges
      .filter((edge) => this.isEdgeInFloor(paths, edge, currentFloor))
      .map((edge) => polyline([
        latLng(paths.nodes[edge.begin].latitude, paths.nodes[edge.begin].longitude),
        latLng(paths.nodes[edge.end].latitude, paths.nodes[edge.end].longitude),
      ]));
  }

  private isEdgeInFloor(paths: IndoorAtlasPaths, edge: IndoorAtlasEdge, floor: number): boolean {
    return paths.nodes[edge.begin].floor === floor || paths.nodes[edge.end].floor === floor;
  }
}
