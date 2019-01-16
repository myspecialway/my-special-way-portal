import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Location } from './../../../models/location.model';
import { LocationService } from './../../../services/location/location.graphql.service';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import BlockedSection from '../../../models/blocked-section.model';
import { MapsService } from './services/maps.container.service';
import { AddMapDialogComponent } from './dialogs/add-map/add-map.dialog';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';
import { MapProxyService } from './services/map-proxy.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { IMapsFile, IMapsFileBase, IFileEvent, FloorEventType } from '../../../models/maps.file.model';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.component.html',
  styleUrls: ['./maps.container.component.scss'],
})
export class MapsContainerComponent implements OnInit {
  filesObservers: Array<Observable<IMapsFile>> = [];
  displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];
  idOrNew: string;
  links: any;
  activeLink: string;
  dataSource = new MatTableDataSource<BlockedSection>();
  locations: Location[] = [];
  currentFloor = 0;
  imagesContaier: Map<string, IMapsFile> = new Map<string, IMapsFile>();
  imagesMetaData: IMapsFileBase[] = [];
  imagePath: any;
  @SubscriptionCleaner()
  subCollector;

  floorMapName: string;

  constructor(
    private dialog: MatDialog,
    private mapsService: MapsService,
    private locationService: LocationService,
    private mswSnackbar: MSWSnackbar,
    private mapProxyService: MapProxyService,
    private _sanitizer: DomSanitizer,
    private communicationService: CommunicationService<IFileEvent>,
  ) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    try {
      this.subCollector.add(
        this.mapsService.getAllBlockedSections().subscribe((data) => {
          this.dataSource.data = [...data];
        }),
        this.locationService.getLocationsFeed$().subscribe((data) => {
          this.locations = data;
        }),
        this.mapProxyService.read().subscribe((ids: string[]) => {
          ids.forEach((id) => {
            this.filesObservers.push(this.mapProxyService.read<IMapsFile>(id));
          });
          forkJoin(this.filesObservers).subscribe(this.handleFiles);
        }),
      );
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
  }
  private handleFiles = (mapsFileList: IMapsFile[]) => {
    this.imagesMetaData = [];
    mapsFileList.forEach(this.handleNewImage);
    this.showImage();
  };

  private handleNewImage = (mapsFile: IMapsFile) => {
    this.imagesContaier.set(mapsFile.id, mapsFile);
    this.emitForFloorBar(mapsFile, true);
  };

  private findMinFloorId() {
    const item = Array.from(this.imagesContaier.values()).reduce((prev, curr) => {
      return +prev.floor < +curr.floor ? prev : curr;
    });
    return item;
  }

  private showImage(firstMap?: IMapsFile | string) {
    if (!firstMap) {
      firstMap = this.imagesContaier.get(this.findMinFloorId().id);
    }
    if (typeof firstMap === 'string') {
      firstMap = this.imagesContaier.get(firstMap);
    }
    if (firstMap) {
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${firstMap.mime};base64,${firstMap.src}`);
    }
  }

  private emitForFloorBar(value: IMapsFile, isInit: boolean) {
    if (isInit) {
      this.imagesMetaData.push({
        fileName: value.fileName,
        floor: value.floor,
        id: value.id,
      });
    } else {
      this.communicationService.emitEvent({
        payload: {
          fileName: value.fileName,
          floor: value.floor,
          id: value.id,
        },
        type: FloorEventType.UPLOAD,
      });
    }
  }

  onFloorChange(event: IFileEvent) {
    if (event.type === FloorEventType.CLICK && event.payload) {
      this.showImage(event.payload.id);
    }
    if (event.type === FloorEventType.DELETE && event.payload) {
      this.mapProxyService.delete(event.payload.id).subscribe(() => {
        this.onSuccessDeleteMap(event);
        console.log('(((((((((((((((((((((((((((())))))))))))))))))))))))))))');
      });
    }
    // this.currentFloor = index;
  }

  private onSuccessDeleteMap(event: IFileEvent) {
    const id = event.payload.id;
    this.imagesContaier.delete(id);
    this.communicationService.emitEvent({
      payload: {
        id,
      },
      type: FloorEventType.DELETE,
    });
    this.showImage();
  }

  addMap() {
    const dialogRef = this.dialog.open(AddMapDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (fileEvent: IFileEvent) => {
        if (fileEvent.type === FloorEventType.UPLOAD) {
          const id = fileEvent.payload.id;
          this.mapProxyService.read<IMapsFile>(id).subscribe((image) => {
            this.imagesContaier.set(image.id, image);
            this.emitForFloorBar(image, false);
            this.showImage(image.id);
          });
        } else {
          //handle error here
        }
      });
  }

  addOrEditBlock(blockedSection) {
    let isNewBlock = true;
    let dataObj = {};
    if (blockedSection && blockedSection.reason && blockedSection.from && blockedSection.to) {
      isNewBlock = false;
      dataObj = { ...blockedSection, isNewBlock };
    } else {
      dataObj = { isNewBlock };
    }
    const dialogRef = this.dialog.open(AddUpdateBlockDialogComponent, {
      data: dataObj,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (result) => {
        if (result) {
          try {
            if (isNewBlock) {
              if (this.blockedSectionAlreadyExists(result)) {
                this.mswSnackbar.displayTimedMessage('לא ניתן להוסיף את אותו קטע חסום');
              } else {
                await this.mapsService.create(result);
              }
            } else {
              await this.mapsService.update(result);
            }
          } catch (error) {
            // TODO: implement error handling on UI
            console.error('Error handling not implemented');
            throw error;
          }
        }
      });
  }

  blockedSectionAlreadyExists(blockedSection: BlockedSection) {
    for (const bS of this.dataSource.data) {
      if (bS.reason === blockedSection.reason && bS.from === blockedSection.from && bS.to === blockedSection.to) {
        return true;
      }
    }
    return false;
  }

  deleteBlock({ _id, from, to, reason }: BlockedSection) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מקטע חסום',
        question: `המקטע ${from} - ${to} - ${reason}`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.mapsService.delete(_id);
          } catch (error) {
            // TODO: implement error handling on UI
            console.error('Error handling not implemented');
            throw error;
          }
        }
      });
  }
}
