import { AddEditPointDialogComponent } from './../../../dialogs/add-edit-point/add-edit-point.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation, emptyMapPoint } from './../../../../../../models/location.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-map-points-view',
  templateUrl: './map-points.view.component.html',
  styleUrls: ['./map-points.view.component.scss'],
})
export class MapPointsViewComponent {
  displayedColumns = ['name', 'label', 'icon', 'type', 'delete'];

  @Input()
  locations: Location[];

  @Input()
  floor: number;

  @Input()
  imageId: string;

  @Output()
  update = new EventEmitter<InputLocation>();

  @Output()
  delete = new EventEmitter<Location>();

  constructor(public dialog: MatDialog) {}

  onEdit(data?: Location) {
    if (!data) {
      data = { ...emptyMapPoint, position: { floor: this.floor }, image_id: this.imageId };
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
