import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  IterableDiffers,
  DoCheck,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { IMapBasePayload, IFileEvent, MapEventType, DeletePayload } from '../../../../../models/maps.file.model';
import * as _ from 'lodash';
import { CommunicationService } from '../../services/communication.service';
import { Subscription } from 'apollo-client/util/Observable';

@Component({
  selector: 'app-map-floor-list',
  templateUrl: './map-floor-list.component.html',
  styleUrls: ['./map-floor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFloorListComponent implements DoCheck, OnDestroy {
  private subscription: Subscription;
  private differ: any;
  floors: IMapBasePayload[] = [];

  @Output()
  change: EventEmitter<IFileEvent> = new EventEmitter<IFileEvent>();

  constructor(
    private differs: IterableDiffers,
    private _changeDetector: ChangeDetectorRef,
    private communicationService: CommunicationService<IFileEvent>,
  ) {
    this.differ = this.differs.find([]).create();
    this.subscription = this.communicationService.subscribeParantChanged(this.parentCommunication, null);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public parentCommunication = (event: IFileEvent) => {
    let markTheFirst = false;
    if (event.type === MapEventType.MAP_DELETE) {
      this.removeItemFromMetaData((event.payload as DeletePayload).id);
      this.markActiveSelectedItem((event.payload as DeletePayload).next_active_id);
      markTheFirst = true;
    }
    if (event.type === MapEventType.MAP_UPLOAD) {
      const payload = event.payload as IMapBasePayload;
      this.floors.push(payload);
      this.markActiveSelectedItem(payload.id);
    }
    if (event.type === MapEventType.FLOOR_UPDATE_LIST) {
      const payload = event.payload as IMapBasePayload[];
      this.floors = payload;
      markTheFirst = true;
    }
    this.sortImageMetaDataList();
    if (markTheFirst) {
      this.markActiveSelectedItem(this.floors[0].id);
    }
    this._changeDetector.detectChanges();
  };

  private markActiveSelectedItem(id: string) {
    this.markItem((item: IMapBasePayload) => {
      return item.id !== id;
    }, false);

    this.markItem((item: IMapBasePayload) => {
      return item.id === id;
    }, true);
  }

  private markItem(condition: (item: IMapBasePayload) => boolean, isActive: boolean) {
    _.filter(this.floors, (floor: IMapBasePayload) => {
      return condition(floor);
    }).forEach((item) => {
      item.isActive = isActive;
    });
  }
  private removeItemFromMetaData(id: string): any {
    _.remove(this.floors, (metaData: IMapBasePayload) => {
      return metaData.id === id;
    });

    // this.floors = _.cloneDeep(list);
  }

  private sortImageMetaDataList() {
    this.floors = this.floors.sort((a: IMapBasePayload, b: IMapBasePayload) => {
      return +a.floor - +b.floor;
    });
  }
  ngDoCheck() {
    const change = this.differ.diff(this.floors);
    if (change) {
      if (this.floors.length) {
        this.sortImageMetaDataList();
      }
    }
  }

  onDelete(event: MouseEvent, map: IMapBasePayload) {
    event.stopPropagation();
    this.change.emit({
      payload: map,
      type: MapEventType.MAP_DELETE,
    });
  }
  onSelect(event: MouseEvent, map: IMapBasePayload) {
    this.markActiveSelectedItem(map.id);
    this.change.emit({
      payload: map,
      type: MapEventType.MAP_SELECT,
    });
  }
}
