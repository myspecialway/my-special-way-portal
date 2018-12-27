import { MAP_FLOOR_MAPS } from './../../../maps-constants';
import { Location } from './../../../../../models/location.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import { IMapFloor } from '../../../../../models/maps.model';

@Component({
  selector: 'app-map-floor-list',
  templateUrl: './map-floor-list.component.html',
  styleUrls: ['./map-floor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFloorListComponent implements OnInit {
  floors: IMapFloor[];

  @Input()
  currentFloor = 0;

  @Input()
  set locations(value: Location[]) {
    this.updateFloors(value || []);
  }

  @Output()
  change: EventEmitter<IMapFloor> = new EventEmitter<IMapFloor>();

  @Output()
  delete: EventEmitter<IMapFloor> = new EventEmitter<IMapFloor>();

  constructor(public locationService: LocationService) {}

  async ngOnInit() {
    // const locations = await this.locationService.getLocations();
    // this.setFloor(this.currentFloor);
  }

  updateFloors(locations: Location[]) {
    const floors = locations.map((location) => location.position.floor);
    const distinctFloorIndexes = Array.from(new Set(floors));
    distinctFloorIndexes.sort();
    this.floors = this.getFloorItems(distinctFloorIndexes);
  }

  private getFloorItems(floorIndexes: number[]) {
    return floorIndexes.reduce((items, floorindex: number) => {
      const floorItem = MAP_FLOOR_MAPS.find(({ index }) => index === floorindex);
      if (floorItem) {
        return [...items, floorItem];
      } else {
        return items;
      }
    }, []);
  }

  onClick(ev: MouseEvent) {
    const elm = ev && (ev.target as Element);
    if (!elm) return;
    const floorIndex = Number(elm['value'] || (elm.parentElement && elm.parentElement['value']));
    const isDelete = elm.getAttribute('data-action') === 'delete';
    const selectedFloorItem = Number.isFinite(floorIndex) && this.floors.find(({ index }) => index === floorIndex);
    if (selectedFloorItem) {
      this.currentFloor = floorIndex;
      if (isDelete) {
        this.delete.emit(selectedFloorItem);
      } else {
        this.change.emit(selectedFloorItem);
      }
    }
  }
}
