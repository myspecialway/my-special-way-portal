import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  IterableDiffers,
  DoCheck,
  ChangeDetectorRef,
} from '@angular/core';
import { IMapsFileBase, IFileEvent, FloorEventType, DeleteEvent } from '../../../../../models/maps.file.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-map-floor-list',
  templateUrl: './map-floor-list.component.html',
  styleUrls: ['./map-floor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFloorListComponent implements DoCheck {
  @Input()
  floors: IMapsFileBase[] = [];

  @Output()
  change: EventEmitter<IFileEvent> = new EventEmitter<IFileEvent>();
  private differ: any;

  constructor(private differs: IterableDiffers, private _changeDetector: ChangeDetectorRef) {
    this.differ = this.differs.find([]).create();
  }

  public parentCommunication = (event: IFileEvent) => {
    if (event.type === FloorEventType.DELETE) {
      this.removeItemFromMetaData(event.payload.id);
      this.markActiveSelectedItem((event.payload as DeleteEvent).next_active_id);
    }
    if (event.type === FloorEventType.UPLOAD) {
      const payload = event.payload as IMapsFileBase;
      this.floors.push(payload);
      this.markActiveSelectedItem(event.payload.id);
    }
    this.sortImageMetaDataList();
    this._changeDetector.detectChanges();
  };

  private markActiveSelectedItem(id: string) {
    this.markItem((item: IMapsFileBase) => {
      return item.id !== id;
    }, false);

    this.markItem((item: IMapsFileBase) => {
      return item.id === id;
    }, true);
  }

  private markItem(condition: (item: IMapsFileBase) => boolean, isActive: boolean) {
    _.filter(this.floors, (floor: IMapsFileBase) => {
      return condition(floor);
    }).forEach((item) => {
      item.isActive = isActive;
    });
  }
  private removeItemFromMetaData(id: string): any {
    _.remove(this.floors, (metaData: IMapsFileBase) => {
      return metaData.id === id;
    });

    // this.floors = _.cloneDeep(list);
  }

  private sortImageMetaDataList() {
    this.floors = this.floors.sort((a: IMapsFileBase, b: IMapsFileBase) => {
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

  onDelete(event: MouseEvent, map: IMapsFileBase) {
    event.stopPropagation();
    this.change.emit({
      payload: map,
      type: FloorEventType.DELETE,
    });
  }
  onSelect(event: MouseEvent, map: IMapsFileBase) {
    this.markActiveSelectedItem(map.id);
    this.change.emit({
      payload: map,
      type: FloorEventType.SELECT,
    });
  }
}
