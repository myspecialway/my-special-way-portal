import { Location } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations"></app-map-points-view>`,
  styleUrls: ['./map-points.component.scss'],
})
export class MapPointsComponent implements OnInit {
  locations: Location[] = [];
  currentFloorLocations: Location[];
  floor = 0;

  @Input('floor')
  set _floor(value) {
    this.floor = Number(value);
    this.updateFloorLocations();
  }

  constructor(public locationService: LocationService) {}

  async ngOnInit() {
    this.locations = await this.locationService.getLocations();
    this.updateFloorLocations();
  }

  updateFloorLocations() {
    this.currentFloorLocations = this.locations.filter((location) => location.position.floor === this.floor);
  }
}
