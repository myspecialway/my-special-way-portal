import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';
import { MatTableDataSource, MatDialog } from '@angular/material';

import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';
import BlockedSection from '../../../models/blocked-section.model';
import { MapsService } from './services/maps.container.service';

// const mockedData: BlockedSection[] = [
//   {
//     _id: 1,
//     reason: 'שיפוץ',
//     from: 'A',
//     to: 'B',
//   },
//   {
//     _id: 2,
//     reason: 'הצפה',
//     from: 'A',
//     to: 'C',
//   },
//   {
//     _id: 3,
//     reason: 'מרתון תל אביב',
//     from: 'C',
//     to: 'B',
//   },
//   {
//     _id: 4,
//     reason: 'גודזילה',
//     from: 'D',
//     to: 'B',
//   },
// ];

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
  // dataSource = mockedData;
  dataSource = new MatTableDataSource<BlockedSection>();

  @SubscriptionCleaner()
  subCollector;
  // private mapsService: MapsService
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private mapsService: MapsService) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[1].label;
  }

  ngOnInit(): void {
    // this.subCollector.add(
    //   this.route.params.subscribe((params) => {
    //     this.idOrNew = params.idOrNew;
    //   }),
    // );

    try {
      this.subCollector.add(
        this.mapsService.getAllBlockedSections().subscribe((data) => {
          this.dataSource.data = [...data];
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
          if (!result) {
            return;
          }

          try {
            if (isNewBlock) {
              console.log('Need to add a NEW block to somewhere!!');
              await this.mapsService.create(result);
            } else {
              console.log('Need to UPDATE a block to somewhere!!');
            }
            // await this.studentService.delete(id);
          } catch (error) {
            // TODO: implement error handling on UI
            console.error('Error handling not implemented');
            throw error;
          }
        }),
    );
  }

  deleteBlock(fromPoint: string, toPoint: string, reason: string) {
    const dialogRef = this.dialog.open(DeleteBlockDialogComponent, {
      data: { fromPoint, toPoint, reason },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (deletionConfirmed) => {
        if (!deletionConfirmed) {
          return;
        }

        try {
          // await this.studentService.delete(id);
          console.log('Need to delete the block from somewhere!!');
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
  }
}
