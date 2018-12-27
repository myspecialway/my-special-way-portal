import { DeleteBlockDialogComponent } from './../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations" (delete)="onDelete($event)" (update)="onUpdate($event)"></app-map-points-view>`,
  styleUrls: ['./map-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPointsComponent implements OnInit {
  currentFloorLocations: Location[];
  locations: Location[] = [];
  floor = 0;

  @Input('floor')
  set _floor(value) {
    if (!this.locations) return;
    this.floor = Number(value);
    this.updateFloorLocations();
  }

  @Input('locations')
  set _locations(value: Location[]) {
    if (!value) return;
    this.locations = value;
    this.updateFloorLocations();
  }

  constructor(public locationService: LocationService, private dialog: MatDialog) {}

  async ngOnInit() {}

  updateFloorLocations() {
    const floorLocations = this.locations.filter((location) => location.position.floor === this.floor);
    floorLocations.sort(
      (location1, location2) =>
        location1.location_id > location2.location_id ? 1 : location2.location_id > location1.location_id ? -1 : 0,
    );
    this.currentFloorLocations = floorLocations;
  }

  onDelete(point: Location) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'נקודת ניווט',
        question: `נקודה - "${point.location_id} - ${point.name}"`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (deletionConfirmed) => {
        if (!deletionConfirmed) {
          return;
        }

        try {
          console.log('Need to delete the point ${point._id} from somewhere!!');
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }

  onUpdate(location: InputLocation) {
    this.locationService.update(location);
  }
}
