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

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.html',
  styleUrls: ['./maps.container.scss'],
})
export class MapsContainerComponent implements OnInit {
  displayedColumns = ['reason', 'from', 'to', 'deleteBlock'];
  idOrNew: string;
  links: any;
  activeLink: string;
  dataSource = new MatTableDataSource<BlockedSection>();
  locations: Location[] = [];
  currentFloor = 0;
  @SubscriptionCleaner()
  subCollector;

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
    this.activeLink = this.links[1].label;
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
      );
    } catch (error) {
      // TODO: implement error handling on UI
      console.error('Error handling not implemented');
      throw error;
    }
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
    this.subCollector.add(
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
        }),
    );
  }

  blockedSectionAlreadyExists(blockedSection: BlockedSection) {
    for (var i = 0; i < this.dataSource.data.length; i++) {
      if (
        this.dataSource.data[i].reason === blockedSection.reason &&
        this.dataSource.data[i].from === blockedSection.from &&
        this.dataSource.data[i].to === blockedSection.to
      ) {
        return true;
      }
    }
    return false;
  }

  deleteBlock(blockedSection: BlockedSection) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: blockedSection,
    });

    this.subCollector.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe(async (result) => {
          if (result) {
            try {
              await this.mapsService.delete(blockedSection._id);
            } catch (error) {
              // TODO: implement error handling on UI
              console.error('Error handling not implemented');
              throw error;
            }
          }
        }),
    );
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
  onFloorChange(floor) {
    this.currentFloor = floor;
  }
}
