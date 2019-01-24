import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Location } from './../../../models/location.model';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import BlockedSection from '../../../models/blocked-section.model';
import { AddMapDialogComponent } from './dialogs/add-map/add-map.dialog';
import { MapProxyService } from './services/map-proxy.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { IMapsFile, IMapBasePayload, IFileEvent, MapEventType, IDPayload } from '../../../models/maps.file.model';
import { forkJoin } from 'rxjs';

import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.component.html',
  styleUrls: ['./maps.container.component.scss'],
})
export class MapsContainerComponent implements OnInit, OnDestroy {
  private subscribtion: Subscription = new Subscription();
  filesObservers: Array<Observable<IMapsFile>> = [];
  imagesContainer: Map<string, IMapsFile> = new Map<string, IMapsFile>();
  imagePath: any;
  @SubscriptionCleaner()
  subCollector;

  constructor(
    private dialog: MatDialog,
    private mapProxyService: MapProxyService,
    private _sanitizer: DomSanitizer,
    private communicationService: CommunicationService<IFileEvent>,
  ) {}

  ngOnInit(): void {
    this.populateMaps();
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  populateMaps() {
    this.subCollector.add(
      this.mapProxyService.read().subscribe((ids: string[]) => {
        ids.forEach((id) => {
          this.filesObservers.push(this.mapProxyService.read<IMapsFile>(id));
        });
        this.subscribtion.add(forkJoin(this.filesObservers).subscribe(this.handleFiles));
      }),
    );
  }

  private handleFiles = (mapsFileList: IMapsFile[]) => {
    const list: IMapBasePayload[] = mapsFileList.map(this.handleNewImage);
    this.communicationService.emitEvent({
      type: MapEventType.FLOOR_UPDATE_LIST,
      payload: list,
    });

    const payload = this.showImage();
    this.communicationService.emitEvent({
      payload,
      type: MapEventType.LOCATION_UPDATE,
    });
  };

  private handleNewImage = (mapsFile: IMapsFile): IMapBasePayload => {
    this.imagesContainer.set(mapsFile.id, mapsFile);
    return {
      fileName: mapsFile.fileName,
      floor: mapsFile.floor,
      id: mapsFile.id,
      isActive: false,
    };
  };

  private findMinFloorId() {
    const item = Array.from(this.imagesContainer.values()).reduce((prev, curr) => {
      return +prev.floor < +curr.floor ? prev : curr;
    });
    return item;
  }

  private showImage(firstMap?: IMapsFile | string) {
    let id;
    let floor;
    if (firstMap === undefined) {
      firstMap = this.imagesContainer.get(this.findMinFloorId().id);
    }
    if (typeof firstMap === 'string') {
      firstMap = this.imagesContainer.get(firstMap);
    }
    if (firstMap) {
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${firstMap.mime};base64,${firstMap.src}`);
      id = firstMap.id;
      floor = firstMap.floor;
    }
    return { id, floor };
  }

  private synchronizeFloorBarOnNewMap(value: IMapsFile) {
    this.communicationService.emitEvent({
      payload: {
        fileName: value.fileName,
        floor: value.floor,
        id: value.id,
        isActive: true,
      },
      type: MapEventType.MAP_UPLOAD,
    });
  }

  onFloorChange(event: IFileEvent) {
    if (event.type === MapEventType.MAP_SELECT && event.payload) {
      const payload = this.showImage((event.payload as IDPayload).id);
      this.communicationService.emitEvent({
        payload,
        type: MapEventType.LOCATION_UPDATE,
      });
    }
    if (event.type === MapEventType.MAP_DELETE && event.payload) {
      if (this.imagesContainer.size > 1) {
        this.deleteMap(event);
      } else {
        this.lastMapAlert();
      }
    }
  }

  private onSuccessDeleteMap(event: IFileEvent) {
    const id = (event.payload as IDPayload).id;
    this.imagesContainer.delete(id);
    const res = this.showImage();
    this.communicationService.emitEvent({
      payload: {
        id,
        next_active_id: res.id,
        floor: res.floor,
      },
      type: MapEventType.MAP_DELETE,
    });
  }

  addMap() {
    const dialogRef = this.dialog.open(AddMapDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (fileEvent: IFileEvent) => {
        if (fileEvent && fileEvent.type === MapEventType.MAP_UPLOAD) {
          const id = (fileEvent.payload as IDPayload).id;
          this.mapProxyService.read<IMapsFile>(id).subscribe((image) => {
            this.imagesContainer.set(image.id, image);
            this.synchronizeFloorBarOnNewMap(image);
            this.showImage(image.id);
          });
        } else {
          //handle error here
        }
      });
  }

  lastMapAlert() {
    this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מחיקת מפה',
        isOnlyAlert: true,
        question: ' לא ניתן למחוק את המפה האחרונה',
      },
    });
  }

  deleteMap(event: IFileEvent) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מחיקת מפה',
        question: `האם אתה בטוח שברצונך למחוק את המפה`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (result) => {
        if (result) {
          try {
            this.mapProxyService.delete((event.payload as IDPayload).id).subscribe(() => {
              this.onSuccessDeleteMap(event);
            });
          } catch (error) {
            // TODO: implement error handling on UI
            console.error('Error handling not implemented');
            throw error;
          }
        }
      });
  }
}
