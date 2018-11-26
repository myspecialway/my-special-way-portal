import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-map-floor-list',
  templateUrl: './map-floor-list.component.html',
  styleUrls: ['./map-floor-list.component.scss'],
})
export class MapFloorListComponent implements OnInit {
  floors: number[];

  @Input()
  currentFloor = 0;

  @Output()
  change: EventEmitter<number> = new EventEmitter<number>();

  constructor(public locationService: LocationService) {}

  async ngOnInit() {
    const locations = await this.locationService.getLocations();
    // this.setFloor(this.currentFloor);
    const floors = locations.map((location) => location.position.floor);
    floors.sort();
    this.floors = Array.from(new Set(floors));
  }

  onFloorClick(ev: MouseEvent) {
    const floor = Number(ev && ev.target && ev.target['value']);
    if (Number.isFinite(floor) && this.floors.includes(floor)) {
      this.currentFloor = floor;
      this.change.emit(floor);
    }
  }
}
