import { DeleteBlockDialogComponent } from './../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations" (delete)="onDelete($event)" (update)="onUpdate($event)"></app-map-points-view>`,
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

  constructor(public locationService: LocationService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.locations = await this.locationService.getLocations();
    this.updateFloorLocations();
  }

  updateFloorLocations() {
    this.currentFloorLocations = this.locations
      .filter((location) => location.position.floor === this.floor)
      // todo - integrate icon as part of Location DB model
      .map((location) => ({ ...location, icon: '' }));
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

  onUpdate(location: InputLocation) {}
}
