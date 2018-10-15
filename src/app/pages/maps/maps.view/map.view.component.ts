import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputLocation, Location } from '../../../models/location.model';

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
  updateLocation: EventEmitter<InputLocation> = new EventEmitter<InputLocation>();
  @Output()
  deleteLocation: EventEmitter<InputLocation> = new EventEmitter<InputLocation>();

  onLocationDisabledChanged(location: Location, disabled: boolean) {
    this.updateLocation.emit({ _id: location._id, disabled });
  }
  onLocationNameChanged(location: Location, name: string) {
    this.updateLocation.emit({ _id: location._id, name });
  }
  onLocationIdChanged(location: Location, location_id: string) {
    this.updateLocation.emit({ _id: location._id, location_id });
  }
}
