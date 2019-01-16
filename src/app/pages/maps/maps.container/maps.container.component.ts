import { Component, OnInit, ViewChild } from '@angular/core';
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

import { MapFloorListComponent } from './tabs/map-floor-list/map-floor-list.component';

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.component.html',
  styleUrls: ['./maps.container.component.scss'],
})
export class MapsContainerComponent implements OnInit {
  filesObservers: Array<Observable<IMapsFile>> = [];
  @ViewChild('mapFloorList')
  mapFloorListComponent: MapFloorListComponent;

  displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];
  idOrNew: string;
  links: any;
  activeLink: string;
  dataSource = new MatTableDataSource<BlockedSection>();
  locations: Location[] = [];
  currentFloor = 0;
  availablePositions: Location[] = [];
  allBlockedSections: BlockedSection[] = [];
  imagesContainer: Map<string, IMapsFile> = new Map<string, IMapsFile>();
  imagesMetaData: IMapsFileBase[] = [];
  imagePath: any;
  @SubscriptionCleaner()
  subCollector;

  constructor(
    private dialog: MatDialog,
    private mapsService: MapsService,
    private locationService: LocationService,
    private mswSnackbar: MSWSnackbar,
    private mapProxyService: MapProxyService,
    private _sanitizer: DomSanitizer,
  ) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    this.populateLocations();
    this.populateBlockedSectionsData();
  }

  populateLocations() {
    this.subCollector.add(
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
  }

  populateBlockedSectionsData() {
    this.subCollector.add(
      this.mapsService.getAllBlockedSections().subscribe((data) => {
        this.allBlockedSections = [...data];
        this.populateAvailablePositions(this.locations);
        this.populateBlockedSectionsByFloor(this.currentFloor);
      }),
    );
  }

  populateAvailablePositions(locations) {
    this.availablePositions = locations.filter((data) => {
      return data.position.floor === this.currentFloor;
    });
  }

  populateBlockedSectionsByFloor(floor) {
    this.dataSource.data = this.allBlockedSections.filter((data) => {
      const position = this.getPositionByLocationId(this.availablePositions, data.from);
      if (position) {
        return position.position.floor === floor;
      }
    });
  }

  getLocationByName(locations: Location[], positionName: string) {
    return locations.find((data) => {
      return data.location_id === positionName;
    });
  }

  getPositionByLocationId(positions: Location[], locationId: string) {
    return positions.find((data) => {
      return data._id === locationId;
    });
  }
  private handleFiles = (mapsFileList: IMapsFile[]) => {
    this.imagesMetaData = [];
    mapsFileList.forEach(this.handleNewImage);
    this.showImage();
  };

  private handleNewImage = (mapsFile: IMapsFile) => {
    this.imagesContainer.set(mapsFile.id, mapsFile);
    this.emitForFloorBar(mapsFile, true);
  };

  private findMinFloorId() {
    const item = Array.from(this.imagesContainer.values()).reduce((prev, curr) => {
      return +prev.floor < +curr.floor ? prev : curr;
    });
    return item;
  }

  private showImage(firstMap?: IMapsFile | string) {
    if (firstMap === undefined) {
      firstMap = this.imagesContainer.get(this.findMinFloorId().id);
    }
    if (typeof firstMap === 'string') {
      firstMap = this.imagesContainer.get(firstMap);
    }
    if (firstMap) {
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${firstMap.mime};base64,${firstMap.src}`);
      return firstMap.id;
    }
  }

  private emitForFloorBar(value: IMapsFile, isInit: boolean) {
    if (isInit) {
      this.imagesMetaData.push({
        fileName: value.fileName,
        floor: value.floor,
        id: value.id,
        isActive: false,
      });
    } else {
      this.mapFloorListComponent.parentCommunication({
        payload: {
          fileName: value.fileName,
          floor: value.floor,
          id: value.id,
          isActive: true,
        },
        type: FloorEventType.UPLOAD,
      });
    }
  }

  onFloorChange(event: IFileEvent) {
    if (event.type === FloorEventType.SELECT && event.payload) {
      this.showImage(event.payload.id);
      this.currentFloor = Number((event.payload as IMapsFileBase).floor);
      this.populateAvailablePositions(this.locations);
      this.populateBlockedSectionsByFloor(this.currentFloor);
    }
    if (event.type === FloorEventType.DELETE && event.payload) {
      if (this.imagesContainer.size > 1) {
        this.deleteMap(event);
      } else {
        this.lastMapAlert();
      }
    }
  }

  private onSuccessDeleteMap(event: IFileEvent) {
    const id = event.payload.id;
    this.imagesContainer.delete(id);
    const next_active_id = this.showImage();
    if (next_active_id) {
      this.mapFloorListComponent.parentCommunication({
        payload: {
          id,
          next_active_id,
        },
        type: FloorEventType.DELETE,
      });
    }
  }

  addMap() {
    const dialogRef = this.dialog.open(AddMapDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (fileEvent: IFileEvent) => {
        if (fileEvent && fileEvent.type === FloorEventType.UPLOAD) {
          const id = fileEvent.payload.id;
          this.mapProxyService.read<IMapsFile>(id).subscribe((image) => {
            this.imagesContainer.set(image.id, image);
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
    let dataObj;
    if (blockedSection && blockedSection.reason && blockedSection.from && blockedSection.to) {
      isNewBlock = false;
      dataObj = { ...blockedSection, isNewBlock };
      dataObj.availablePositions = this.availablePositions;
      dataObj.getPositionByLocationId = this.getPositionByLocationId;
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
          const fromLocation = this.getLocationByName(this.availablePositions, result.from);
          const toLocation = this.getLocationByName(this.availablePositions, result.to);
          if (fromLocation) {
            result.from = fromLocation._id;
          }
          if (toLocation) {
            result.to = toLocation._id;
          }
          if (isNewBlock) {
            if (this.blockedSectionAlreadyExists(result)) {
              this.mswSnackbar.displayTimedMessage('לא ניתן להוסיף את אותו קטע חסום');
            } else {
              await this.mapsService.create(result);
              this.populateBlockedSectionsData();
            }
          } else {
            await this.mapsService.update(result);
            this.populateBlockedSectionsData();
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
  lastMapAlert() {
    this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מחיקת מפה',
        isOnlyAlert: true,
        alertText: ' ללא ניתן למחוק את המפה האחרונה',
      },
    });
  }

  deleteMap(event: IFileEvent) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מחיקת מפה',
        question: `המפה`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (result) => {
        if (result) {
          try {
            this.mapProxyService.delete(event.payload.id).subscribe(() => {
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

  deleteBlock({ _id, from, to, reason }: BlockedSection) {
    let fromPosition;
    let toPosition;
    let fromPositionObj;
    let toPositionObj;

    if (this.availablePositions && this.getPositionByLocationId) {
      fromPositionObj = this.getPositionByLocationId(this.availablePositions, from);
      toPositionObj = this.getPositionByLocationId(this.availablePositions, to);
    }
    fromPosition = fromPositionObj ? fromPositionObj.location_id : '';
    toPosition = toPositionObj ? toPositionObj.location_id : '';

    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: {
        title: 'מקטע חסום',
        question: `המקטע ${fromPosition} - ${toPosition} - ${reason}`,
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
