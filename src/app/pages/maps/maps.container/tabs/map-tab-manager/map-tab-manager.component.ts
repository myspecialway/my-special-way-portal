import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import { MatDialog } from '@angular/material';
import { CommunicationService } from '../../services/communication.service';
import { IFileEvent, MapEventType, IDPayload, IMapBasePayload } from '../../../../../models/maps.file.model';
import { DeleteBlockDialogComponent } from '../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { InputLocation, Location } from '../../../../../models/location.model';
import BlockedSection from '../../../../../models/blocked-section.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-tab-manager',
  templateUrl: './map-tab-manager.component.html',
  styleUrls: ['./map-tab-manager.component.scss'],
})
export class MapTabManagerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  links: any;
  activeLink: string;
  currentLocations: Location[];
  currentBlockSections: BlockedSection[] = [];
  floor = 0;

  constructor(
    public locationService: LocationService,
    private dialog: MatDialog,
    private communicationService: CommunicationService<IFileEvent>,
  ) {
    this.subscription = this.communicationService.subscribeParantChanged(this.onParantChange, null);
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onParantChange = (event: IFileEvent) => {
    if (event.type === MapEventType.LOCATION_UPDATE) {
      this.activeLink = this.links[0].label;
      const image_id = (event.payload as IDPayload).id;
      this.floor = (event.payload as IMapBasePayload).floor;
      this.locationService.getLocationByMapId$(image_id, this.floor).subscribe((location) => {
        this.currentLocations = location;
      });
    }
  };

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
          await this.locationService.delete(_id);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }

  onLocationUpdate(location: InputLocation) {
    if (location._id) {
      this.locationService.update(location);
    } else {
      this.locationService.create(location);
    }
  }

  ngOnInit() { }
}
