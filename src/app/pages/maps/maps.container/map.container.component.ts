import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../services/location/location.graphql.service';
import { Location } from '../../../models/location.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-maps-container',
  template: `<app-map-view
              [locations]="currentFloorLocations"
              [floor]="currentFloor"
              [availableFloors]="availableFloors"
              (floorChanged)="setFloor($event)"
              (updateLocation)="updateLocation($event)"
            >
            </app-map-view>
  `,
})
export class MapContainerComponent implements OnInit {
  locations: Location[];
  currentFloorLocations: Location[];
  availableFloors: number[];
  currentFloor = 0;

  constructor(public locationService: LocationService) {}

  async ngOnInit() {
    this.locations = await this.locationService.getLocations();
    this.setFloor(this.currentFloor);
    this.availableFloors = _.uniqBy(this.locations, 'position.floor')
      .map((location) => location.position.floor)
      .sort();
  }

  setFloor(floor: number) {
    this.currentFloor = floor;
    this.currentFloorLocations = this.locations.filter((location) => location.position.floor === floor);
  }

  updateLocation(location: Location) {
    // implement
    console.log(`updating location ${location.name}`);
  }
}
