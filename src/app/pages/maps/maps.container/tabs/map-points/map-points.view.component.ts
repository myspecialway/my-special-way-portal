import { first } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditPointDialogComponent } from '../../dialogs/add-edit-point/add-edit-point.dialog';
import { Location, InputLocation, emptyMapPoint } from '../../../../../models/location.model';
import { DeleteBlockDialogComponent } from '../../dialogs/delete/delete-block.dialog';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import * as _ from 'lodash';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';

@Component({
  selector: 'app-map-points-view',
  templateUrl: './map-points.view.component.html',
  styleUrls: ['./map-points.view.component.scss'],
})
export class MapPointsViewComponent {
  displayedColumns = ['name', 'label', 'icon', 'type', 'delete'];
  //TODO: remove all location with floor that is not curent floor
  private _locations: Location[];
  private _pointFloor: number;
  private _imageId: string;

  @Input('pointFloor')
  set pointFloor(value: number) {
    this._pointFloor = value;
  }

  @Input('locations')
  set locations(i_locations: Location[]) {
    if (i_locations) {
      this._locations = i_locations.filter((location) => {
        if (!location.position) {
          return true;
        }
        return location.position.floor === this._pointFloor ? true : false;
      });
    }
  }

  @Input('pointImageId')
  set pointImageId(value: string) {
    this._imageId = value;
  }

  @Output()
  update = new EventEmitter<InputLocation>();

  @Output()
  delete = new EventEmitter<Location>();

  constructor(public dialog: MatDialog, public locationService: LocationService, private mswSnackbar: MSWSnackbar) {}

  onLocationEdit(data?: Location) {
    if (!data) {
      data = { ...emptyMapPoint, position: { floor: this.pointFloor }, image_id: this._imageId };
    }
    const dialogRef = this.dialog.open(AddEditPointDialogComponent, {
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((update: Partial<Location>) => {
        if (!update) return;
        this.onLocationUpdate({ ...(data as Location), ...update });
      });
  }

  onLocationDelete({ _id, location_id, name }: Location) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'נקודת ניווט',
        question: `האם אתה בטוח שברצונך למחוק את הנקודה - "${location_id} - ${name}"`,
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
          //TODO: delete block section that belong to this location id
          await this.locationService.delete(_id, this._imageId, this._pointFloor);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }

  onLocationUpdate(location: InputLocation) {
    if (this.findItemByLocationName(location)) {
      this.mswSnackbar.displayTimedMessage('נקודה ציון כבר קיימת נא לבחור נקודה חדשה');
      return;
    }

    if (location._id) {
      this.locationService.update(location, this._imageId, this._pointFloor);
    } else {
      this.updateFloor(location);
      this.locationService.create(location, this._imageId, this._pointFloor);
    }
  }

  private updateFloor(location: InputLocation) {
    if (location.position) {
      location.position.floor = this._pointFloor;
    }
  }

  private findItemByLocationName(location: InputLocation) {
    return _.find(this._locations, (locationItem: Location) => {
      return locationItem.location_id === location.location_id;
    });
  }
}
