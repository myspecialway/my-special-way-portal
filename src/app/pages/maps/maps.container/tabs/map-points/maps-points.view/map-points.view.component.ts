import { AddEditPointDialogComponent } from './../../../dialogs/add-edit-point/add-edit-point.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation } from './../../../../../../models/location.model';
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

  @Output()
  update = new EventEmitter<InputLocation>();

  @Output()
  delete = new EventEmitter<Location>();

  constructor(public dialog: MatDialog) {}

  onEdit(data: Location) {
    const dialogRef = this.dialog.open(AddEditPointDialogComponent, {
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((update: Partial<Location>) => {
        if (!update) return;

        this.update.emit({ ...data, ...update });
      });
  }

  onDelete(point: Location) {
    this.delete.emit(point);
  }
}
