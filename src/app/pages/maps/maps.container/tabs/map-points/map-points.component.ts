import { Location } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations"></app-map-points-view>`,
  styleUrls: ['./map-points.component.scss'],
})
export class MapPointsComponent implements OnInit {
  locations: Location[];
  currentFloorLocations: Location[];

  @Input()
  currentFloor = 0;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, public locationService: LocationService) {}

  async ngOnInit() {
    this.locations = await this.locationService.getLocations();
    this.currentFloorLocations = this.getFloorLocations(this.currentFloor);
  }

  getFloorLocations(floor = 0) {
    return this.locations.filter((location) => location.position.floor === floor);
  }
}
