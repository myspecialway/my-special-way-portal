import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import BlockedSection from '../../../../../models/blocked-section.model';
import { BlockedSectionsService } from '../../services/maps.container.service';
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
export class MapBlockSectionComponent implements OnInit {
  private _availableLocations: Location[];
  private dataSource = new MatTableDataSource<BlockedSection>();
  displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];

  @Input('availableLocations')
  set availableLocations(value: Location[]) {
    this._availableLocations = value;
    if (this._availableLocations.length) {
      const locationIds = this.getLocationIdsList(this._availableLocations);
      this.blockedSectionsService.getBlockSectionsByLocations(locationIds).subscribe((blockSections) => {
        this.dataSource.data = blockSections;
      });
    }
  }

  @Output()
  update = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor(
    private mapsService: BlockedSectionsService,
    // tslint:disable-next-line:align
    private dialog: MatDialog,
    // tslint:disable-next-line:align
    private mswSnackbar: MSWSnackbar,
    // tslint:disable-next-line:align
    private blockedSectionsService: BlockedSectionsService,
  ) {}

  private getLocationIdsList(locations) {
    return _.map(locations, (location) => {
      return location._id;
    });
  }

  ngOnInit() {}

  buildLocationNameDictionary(location: Location[]): any {
    //todo implement
    throw new Error('Method not implemented.');
  }

  deleteBlock({ _id, from, to, reason }: BlockedSection) {
    const fromPosition = this.getLocationById(this._availableLocations, from);
    const toPosition = this.getLocationById(this._availableLocations, to);
    if (toPosition && fromPosition) {
      const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
        data: {
          title: 'מקטע חסום',
          question: `האם אתה בטוח שברצונך למחוק את המקטע  ${fromPosition._id} - ${toPosition._id} - ${reason}`,
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

  addOrEditBlock(blockedSection) {
    let isNewBlock = true;
    let dataObj;
    if (blockedSection && blockedSection.reason && blockedSection.from && blockedSection.to) {
      isNewBlock = false;
      dataObj = { ...blockedSection, isNewBlock };
      dataObj.availablePositions = this._availableLocations;
      dataObj.getPositionByLocationId = this.getLocationById;
    } else {
      dataObj = { isNewBlock };
    }

    const dialogRef = this.dialog.open(AddUpdateBlockDialogComponent, {
      data: dataObj,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(
        async (result) => {
          if (result) {
            const fromLocation = this.getLocationByName(this._availableLocations, result.from);
            const toLocation = this.getLocationByName(this._availableLocations, result.to);
            if (fromLocation) {
              result.from = fromLocation._id;
            }
            if (toLocation) {
              result.to = toLocation._id;
            }
            if (!(fromLocation && toLocation)) {
              this.mswSnackbar.displayTimedMessage('אחד הקטעים החסומים אינו קיים');
              return;
            }

            if (this.blockedSectionAlreadyExists(result)) {
              this.mswSnackbar.displayTimedMessage('לא ניתן להוסיף את אותו קטע חסום');
            } else {
              if (isNewBlock) {
                await this.mapsService.create(result);
              } else {
                await this.mapsService.update(result);
              }
            }
          }
        },
        (error) => {
          this.mswSnackbar.displayTimedMessage('שגיאה בעדכון קטע חסום');
        },
      );
  }

  blockedSectionAlreadyExists = (blockedSection: BlockedSection) => {
    if (this.dataSource.data) {
      for (const bS of this.dataSource.data) {
        if (bS.from === blockedSection.from && bS.to === blockedSection.to) {
          return true;
        }
      }
      return false;
    }
    return false;
  };

  // populateBlockedSectionsByFloor(floor) {
  //   this.dataSource.data = this.allBlockedSections.filter((data) => {
  //     const position = this.getPositionByLocationId(this.availablePositions, data.from);
  //     if (position) {
  //       return position.position.floor === floor;
  //     }
  //   });
  // }

  getLocationByName(locations: Location[], positionName: string) {
    return locations.find((data) => {
      return data.location_id === positionName;
    });
  }

  getLocationById(positions: Location[], locationId: string) {
    return positions.find((data) => {
      return data._id === locationId;
    });
  }
  // populateAvailablePositions(locations) {
  //   this.availablePositions = locations.filter((data) => {
  //     return data.position.floor === this.currentFloor;
  //   });
  // }

  // populateBlockedSectionsData() {
  //   this.subCollector.add(
  //     this.mapsService.getAllBlockedSections().subscribe((data) => {
  //       this.allBlockedSections = [...data];
  //       // this.populateAvailablePositions(this.locations);
  //       //this.populateBlockedSectionsByFloor(this.currentFloor);
  //     }),
  //   );
  // }
}
