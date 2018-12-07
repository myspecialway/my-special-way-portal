import { Location, InputLocation } from './../../../../../../models/location.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-map-points-view',
  templateUrl: './map-points.view.component.html',
  styleUrls: ['./map-points.view.component.scss'],
})
export class MapPointsViewComponent {
  displayedColumns = ['name', 'label', 'icon', 'type', 'delete'];

  @Input()
  locations: Location[];

  @Output()
  update = new EventEmitter<InputLocation>();

  @Output()
  delete = new EventEmitter<Location>();

  onUpdate(location: Location, update: Partial<Location>) {
    this.update.emit({ ...location, ...update });
  }

  onDelete(point: Location) {
    this.delete.emit(point);
  }
}
