import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  IterableDiffers,
  DoCheck,
  ChangeDetectorRef,
} from '@angular/core';
import { IMapsFileBase, IFileEvent, FloorEventType } from '../../../../../models/maps.file.model';
import { CommunicationService } from '../../services/communication.service';
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

  constructor(
    private differs: IterableDiffers,
    private communicationService: CommunicationService<IFileEvent>,
    private _changeDetector: ChangeDetectorRef,
  ) {
    this.differ = this.differs.find([]).create();
    this.communicationService.subscribeApsDeviceChanged((event: IFileEvent) => {
      if (event.type === FloorEventType.DELETE) {
        this.removeItemFromMetaData(event.payload.id);
      }
      if (event.type === FloorEventType.UPLOAD) {
        const payload = event.payload as IMapsFileBase;
        this.floors.push(payload);
      }
      this._changeDetector.detectChanges();
    }, null);
  }

  private removeItemFromMetaData(id: string): any {
    _.remove(this.floors, (metaData: IMapsFileBase) => {
      return metaData.id === id;
    });

    console.log(this.floors);
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
    console.log(`delete is cllicked ${event} ${map}`);
    event.stopPropagation();
    this.change.emit({
      payload: map,
      type: FloorEventType.DELETE,
    });
  }
  onClick(event: MouseEvent, map: IMapsFileBase) {
    console.log(`Click is cllicked ${event} ${map}`);
    this.change.emit({
      payload: map,
      type: FloorEventType.CLICK,
    });
  }
}
