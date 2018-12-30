import { DeleteBlockDialogComponent } from './../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations" [floor]="floor" (delete)="onDelete($event)" (update)="onUpdate($event)"></app-map-points-view>`,
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

  onDelete({ _id, location_id, name }: Location) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'נקודת ניווט',
        question: `הנקודה - "${location_id} - ${name}"`,
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
          await this.locationService.delete(_id);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }

  onUpdate(location: InputLocation) {
    if (location._id) {
      this.locationService.update(location);
    } else {
      this.locationService.create(location);
    }
  }
}
