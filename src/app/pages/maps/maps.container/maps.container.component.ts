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
  @SubscriptionCleaner()
  subCollector;

  private floorMapName = MAP_FLOOR_MAPS[this.currentFloor].filename;

  constructor(private dialog: MatDialog, private mapsService: MapsService, private locationService: LocationService) {
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
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (result) => {
        if (result) {
          try {
            if (isNewBlock) {
              await this.mapsService.create(result);
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

  deleteBlock(blockedSection: BlockedSection) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: blockedSection,
    });

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
  }
}
