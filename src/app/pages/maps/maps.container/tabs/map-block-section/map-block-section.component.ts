import { Component, Input, EventEmitter, Output } from '@angular/core';
import BlockedSection from '../../../../../models/blocked-section.model';
import { BlockedSectionsService } from '../../services/blocked.sections.service';
import { MSWSnackbar } from '../../../../../services/msw-snackbar/msw-snackbar.service';
import * as _ from 'lodash';
import { Location } from '../../../../../models/location.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DeleteBlockDialogComponent } from '../../dialogs/delete/delete-block.dialog';
import { first } from 'rxjs/operators';
import { AddUpdateBlockDialogComponent } from '../../dialogs/add-update/add-update-block.dialog';

@Component({
  selector: 'app-map-block-section',
  templateUrl: './map-block-section.component.html',
  styleUrls: ['./map-block-section.component.scss'],
})
export class MapBlockSectionComponent {
  private _availableLocations: Location[];
  private _avaiableLocationsIds: string[];
  private _locationByName: Map<string, Location>;
  private _locationById: Map<string, Location>;
  private _blockFloor: number;
  private blockSections: BlockedSection[];

  public dataSource: MatTableDataSource<BlockedSection>;
  public displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];

  @Input('blockFloor')
  set blockFloor(value: number) {
    this._blockFloor = value;
  }

  @Input('availableLocations')
  set availableLocations(value: Location[]) {
    this._availableLocations = value;
    if (this._availableLocations.length) {
      this.buildLocationDictionaries(this._availableLocations);
      this.refreshBlockSection(true);
    }
  }

  @Output()
  update = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private mswSnackbar: MSWSnackbar,
    private blockedSectionsService: BlockedSectionsService,
  ) {}

  private refreshBlockSection(isInit: boolean) {
    this._avaiableLocationsIds = this.getLocationIdsList(this._availableLocations);
    this.updateBlockByLocations(this._avaiableLocationsIds, isInit);
  }

  private updateBlockByLocations(locationIds: any[], isInit: boolean) {
    this.blockedSectionsService.getBlockSectionsByLocations(locationIds).subscribe((blockSections) => {
      const bs = this.removeAllBlockThatNotBelong(blockSections);
      this.dataSource = new MatTableDataSource<BlockedSection>(bs);
      this.blockSections = bs;
    });
  }

  removeAllBlockThatNotBelong(blockSections: BlockedSection[]): any {
    return blockSections.filter((blockSection) => {
      if (!this.getItem(this._locationById, blockSection.from) || !this.getItem(this._locationById, blockSection.to)) {
        return false;
      }
      return true;
    });
  }

  private getLocationIdsList(locations) {
    return _.map(locations, (location) => {
      return location._id;
    });
  }

  getItem(locations, identify) {
    const item = this.getLocationById(locations, identify);
    if (item) {
      return item.location_id;
    }
    return null;
  }

  buildLocationDictionaries(locations: Location[]): any {
    this._locationById = new Map<string, Location>();
    this._locationByName = new Map<string, Location>();
    locations.forEach((location) => {
      this._locationById.set(location._id, location);
      this._locationByName.set(location.location_id, location);
    });
  }

  deleteBlock({ _id, from, to, reason }: BlockedSection) {
    const fromPosition = this.getLocationById(this._locationById, from);
    const toPosition = this.getLocationById(this._locationById, to);
    if (toPosition && fromPosition) {
      const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
        data: {
          title: 'מקטע חסום',
          question: `האם אתה בטוח שברצונך למחוק את המקטע  ${fromPosition.location_id} - ${
            toPosition.location_id
          } - ${reason}`,
        },
      });
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result) {
            try {
              await this.blockedSectionsService.delete(_id, this._avaiableLocationsIds).then((success) => {
                this.refreshBlockSection(false);
              });
            } catch (error) {
              this.mswSnackbar.displayTimedMessage('מחיקת מקטע חסום נכשלה');
              throw error;
            }
          }
        });
    }
  }

  addOrEditBlock(blockedSection?: any) {
    let dataObj;
    let isNewBlock;

    ({ isNewBlock, dataObj } = this.isEditOrCreateState(dataObj, blockedSection));
    const dialogRef = this.dialog.open(AddUpdateBlockDialogComponent, {
      data: dataObj,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        async (blockSection) => {
          if (blockSection) {
            if (isNewBlock) {
              await this.blockedSectionsService
                .create(blockSection, this._avaiableLocationsIds)
                .then((response) => {
                  if (response.data) {
                    this.refreshBlockSection(false);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  this.mswSnackbar.displayTimedMessage('הוספת מקטע חסום נכשלה');
                });
            } else {
              await this.blockedSectionsService
                .update(blockSection, this._avaiableLocationsIds)
                .then((id) => {
                  this.refreshBlockSection(false);
                })
                .catch((error) => {
                  console.error(error);
                  this.mswSnackbar.displayTimedMessage('הוספת מקטע חסום נכשלה');
                });
            }
          }
        },
        (error) => {
          this.mswSnackbar.displayTimedMessage('שגיאה בעדכון קטע חסום');
        },
      );
  }

  private isEditOrCreateState(dataObj: any, blockedSection?: any) {
    let isNewBlock = true;
    if (blockedSection && blockedSection.reason && blockedSection.from && blockedSection.to) {
      isNewBlock = false;
      dataObj = { ...blockedSection, isNewBlock };
      dataObj.from = (this.getLocationById(this._locationById, blockedSection.from) as any).location_id;
      dataObj.to = (this.getLocationById(this._locationById, blockedSection.to) as any).location_id;
    } else {
      dataObj = { isNewBlock };
    }

    dataObj.blockSections = this.blockSections || [];
    dataObj.floor = this._blockFloor;
    dataObj.locationByName = this._locationByName;
    return { isNewBlock, dataObj };
  }

  getLocationById(_locationById: Map<string, Location>, locationId: string) {
    return _locationById.get(locationId);
  }
}
