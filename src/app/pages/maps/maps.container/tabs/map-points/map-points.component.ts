import { DeleteBlockDialogComponent } from './../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { Location, InputLocation } from './../../../../../models/location.model';
import { LocationService } from './../../../../../services/location/location.graphql.service';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommunicationService } from '../../services/communication.service';
import { IFileEvent, IDPayload, IMapBasePayload, MapEventType } from '../../../../../models/maps.file.model';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-map-points',
  template: `<app-map-points-view [locations]="currentFloorLocations" [floor]="floor" (delete)="onDelete($event)" (update)="onUpdate($event)"></app-map-points-view>`,
  styleUrls: ['./map-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPointsComponent implements OnInit {
  currentFloorLocations: Location[];
  floor;

  @Output()
  change = new EventEmitter();
  constructor(
    public locationService: LocationService,
    private dialog: MatDialog,
    private communicationService: CommunicationService<IFileEvent>,
  ) {
    this.communicationService.subscribeParantChanged(this.onParantChange, null);
  }

  async ngOnInit() {}

  private onParantChange = (event: IFileEvent) => {
    if (event.type === MapEventType.LOCATION_UPDATE) {
      const image_id = (event.payload as IDPayload).id;
      this.locationService.getLocationByMapId$(image_id).subscribe((location) => {
        this.currentFloorLocations = location;
        this.floor = (event.payload as IMapBasePayload).floor;
      });
    }
  };

  onDelete({ _id, location_id, name }: Location) {
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
