import { MAP_FLOOR_MAPS } from './../maps-constants';
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
import { IMapFloor } from '../../../models/maps.model';
import { MSWSnackbar } from '../../../services/msw-snackbar/msw-snackbar.service';

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.component.html',
  styleUrls: ['./maps.container.component.scss'],
})
export class MapsContainerComponent implements OnInit {
  displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];
  idOrNew: string;
  links: any;
  activeLink: string;
  dataSource = new MatTableDataSource<BlockedSection>();
  locations: Location[] = [];
  currentFloor = 0;
  availablePositions: Location[] = [];
  allBlockedSections: BlockedSection[] = [];
  @SubscriptionCleaner()
  subCollector;

  floorMapName: string;

  constructor(
    private dialog: MatDialog,
    private mapsService: MapsService,
    private locationService: LocationService,
    private mswSnackbar: MSWSnackbar,
  ) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    const initialFloor = MAP_FLOOR_MAPS.find(({ index }) => index === this.currentFloor);
    this.onFloorChange(initialFloor as IMapFloor);
    this.populateLocations();
    this.populateBlockedSectionsData();
  }

  populateLocations() {
    this.subCollector.add(
      this.locationService.getLocationsFeed$().subscribe((data) => {
        this.locations = data;
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
          await this.mapsService.delete(_id);
        }
      });
  }

  addMap() {
    const dialogRef = this.dialog.open(AddMapDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (addMapConfirmed) => {
        console.log(addMapConfirmed);
      });
  }

  onFloorChange({ index, filename }) {
    this.currentFloor = index;
    this.floorMapName = filename;
    this.populateAvailablePositions(this.locations);
    this.populateBlockedSectionsByFloor(this.currentFloor);
  }
}
