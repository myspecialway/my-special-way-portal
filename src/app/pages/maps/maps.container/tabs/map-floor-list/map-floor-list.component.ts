import { Location } from './../../../../../models/location.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.graphql.service';

@Component({
  selector: 'app-map-floor-list',
  templateUrl: './map-floor-list.component.html',
  styleUrls: ['./map-floor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFloorListComponent implements OnInit {
  floors: number[];

  @Input()
  currentFloor = 0;

  @Output()
  change: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  set locations(value: Location[]) {
    this.updateFloors(value || []);
  }

  @Output()
  delete: EventEmitter<number> = new EventEmitter<number>();

  constructor(public locationService: LocationService) {}

  async ngOnInit() {
    // const locations = await this.locationService.getLocations();
    // this.setFloor(this.currentFloor);
  }

  updateFloors(locations: Location[]) {
    const floors = locations.map((location) => location.position.floor);
    floors.sort();
    this.floors = Array.from(new Set(floors));
  }

  onClick(ev: MouseEvent) {
    const elm = ev && (ev.target as Element);
    if (!elm) return;
    const floor = Number(elm['value'] || (elm.parentElement && elm.parentElement['value']));
    const isDelete = elm.getAttribute('data-action') === 'delete';

    if (Number.isFinite(floor) && this.floors.includes(floor)) {
      this.currentFloor = floor;
      if (isDelete) {
        this.delete.emit(floor);
      } else {
        this.change.emit(floor);
      }
    }
  }
}
