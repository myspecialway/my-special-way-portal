import { first } from 'rxjs/operators';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditPointDialogComponent } from '../../dialogs/add-edit-point/add-edit-point.dialog';
import { Location, InputLocation, emptyMapPoint } from '../../../../../models/location.model';

@Component({
  selector: 'app-map-points-view',
  templateUrl: './map-points.view.component.html',
  styleUrls: ['./map-points.view.component.scss'],
})
export class MapPointsViewComponent {
  displayedColumns = ['name', 'label', 'icon', 'type', 'delete'];
  //TODO: remove all location with floor that is not curent floor
  @Input()
  locations: Location[];

  @Input()
  pointFloor: number;

  @Input()
  imageId: string;

  @Output()
  update = new EventEmitter<InputLocation>();

  @Output()
  delete = new EventEmitter<Location>();

  constructor(public dialog: MatDialog) {}

  onEdit(data?: Location) {
    if (!data) {
      data = { ...emptyMapPoint, position: { floor: this.pointFloor }, image_id: this.imageId };
    }
    const dialogRef = this.dialog.open(AddEditPointDialogComponent, {
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((update: Partial<Location>) => {
        if (!update) return;

        this.update.emit({ ...(data as Location), ...update });
      });
  }

  onDelete(point: Location) {
    this.delete.emit(point);
  }
}
