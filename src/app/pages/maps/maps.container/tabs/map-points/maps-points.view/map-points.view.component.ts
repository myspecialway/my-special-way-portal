import { Location, InputLocation } from './../../../../../../models/location.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-map-points-view',
  templateUrl: './map-points.view.component.html',
  styleUrls: ['./map-points.view.component.scss'],
})
export class MapPointsViewComponent {
  displayedColumns = ['name', 'label', 'icon', 'enabled', 'delete'];

  @Input()
  locations: Location[];

  @Output()
  updateLocation: EventEmitter<InputLocation> = new EventEmitter<InputLocation>();

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
