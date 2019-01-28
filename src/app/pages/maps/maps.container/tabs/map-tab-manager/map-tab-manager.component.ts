import { Component, OnDestroy } from '@angular/core';
import { LocationService } from '../../../../../services/location/location.graphql.service';
import { CommunicationService } from '../../services/communication.service';
import {
  IFileEvent,
  MapEventType,
  IDPayload,
  IMapBasePayload,
  DeletePayload,
} from '../../../../../models/maps.file.model';
import { Location } from '../../../../../models/location.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-tab-manager',
  templateUrl: './map-tab-manager.component.html',
  styleUrls: ['./map-tab-manager.component.scss'],
})
export class MapTabManagerComponent implements OnDestroy {
  private subscription: Subscription;

  links: any;
  activeLink: string;
  currentLocations: Location[];
  floor = 0;
  imageId = '';
  constructor(public locationService: LocationService, private communicationService: CommunicationService<IFileEvent>) {
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

  public onParantChange = (event: IFileEvent) => {
    if (
      event.type === MapEventType.LOCATION_UPDATE ||
      event.type === MapEventType.MAP_DELETE ||
      event.type === MapEventType.MAP_UPLOAD
    ) {
      this.activeLink = this.links[0].label;
      if (event.type === MapEventType.LOCATION_UPDATE || event.type === MapEventType.MAP_UPLOAD) {
        this.imageId = (event.payload as IDPayload).id;
      }
      if (event.type === MapEventType.MAP_DELETE) {
        this.imageId = (event.payload as DeletePayload).next_active_id;
      }
      this.floor = +(event.payload as IMapBasePayload).floor;
      this.locationService.getLocationByMapId$(this.imageId, this.floor).subscribe((location) => {
        this.currentLocations = location;
      });
    }
  };
}
