import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '../../../models/location.model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map.view.component.html',
  styleUrls: ['./map.view.component.scss'],
})
export class MapViewComponent {
  @Input()
  locations: Location[];
  @Input()
  floor: number;
  @Input()
  availableFloors: number[];

  @Output()
  floorChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  updateLocation: EventEmitter<Location> = new EventEmitter<Location>();

  onLocationStateChanged(location: Location, disabled: boolean) {
    this.updateLocation.emit({ ...location, disabled });
  }
  onLocationNameChanged(location: Location, name: string) {
    this.updateLocation.emit({ ...location, name });
  }
}
