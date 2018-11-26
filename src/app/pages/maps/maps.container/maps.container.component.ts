import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { BlockedSection } from '../../../models/BlockedSection.model';
import { DeleteBlockDialogComponent } from './dialogs/delete/delete-block.dialog';
import { AddUpdateBlockDialogComponent } from './dialogs/add-update/add-update-block.dialog';

// const mockedData: BlockedSection[] = [
//   {
//     blockedReason: 'Reason 1',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 66 },
//   },
//   {
//     blockedReason: 'Reason 2',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 55 },
//   },
//   {
//     blockedReason: 'Reason 3',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 77 },
//   },
//   {
//     blockedReason: 'Reason 4',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 99 },
//   },
//   {
//     blockedReason: 'Reason 1',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 66 },
//   },
//   {
//     blockedReason: 'Reason 2',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 55 },
//   },
//   {
//     blockedReason: 'Reason 3',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 77 },
//   },
//   {
//     blockedReason: 'Reason 4',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 99 },
//   },
//   {
//     blockedReason: 'Reason 5',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 66 },
//   },
//   {
//     blockedReason: 'Reason 6',
//     fromPoint: { latitude: 1, longitude: 2, floor: 6 },
//     toPoint: { latitude: 11, longitude: 22, floor: 55 },
//   },
// ];

const mockedData: BlockedSection[] = [
  {
    blockedReason: 'שיפוץ',
    fromPoint: 'A',
    toPoint: 'B',
  },
  {
    blockedReason: 'הצפה',
    fromPoint: 'A',
    toPoint: 'C',
  },
  {
    blockedReason: 'מרתון תל אביב',
    fromPoint: 'C',
    toPoint: 'B',
  },
  {
    blockedReason: 'גודזילה',
    fromPoint: 'D',
    toPoint: 'B',
  },
];

@Component({
  selector: 'app-maps-container',
  templateUrl: './maps.container.html',
  styleUrls: ['./maps.container.scss'],
})
export class MapsContainerComponent implements OnInit {
  displayedColumns = ['blockedReason', 'fromPoint', 'toPoint', 'deleteBlock'];
  idOrNew: string;
  links: any;
  activeLink: string;
  dataSource = mockedData;

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטעים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[0].label;
  }

  ngOnInit(): void {
    this.subCollector.add(
      this.route.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
      }),
    );
  }

  addOrEditBlock(blockedReason: string, fromPoint: string, toPoint: string) {
    let isNewBlock = true;
    let dataObj = {};
    if (blockedReason && fromPoint && toPoint) {
      isNewBlock = false;
      dataObj = { blockedReason, fromPoint, toPoint, isNewBlock };
    } else {
      dataObj = { isNewBlock };
    }
    const dialogRef = this.dialog.open(AddUpdateBlockDialogComponent, {
      data: dataObj,
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(async (addConfirmed) => {
        if (!addConfirmed) {
          return;
        }

        try {
          if (isNewBlock) {
            console.log('Need to add a NEW block to somewhere!!');
          } else {
            console.log('Need to UPDATE a block to somewhere!!');
          }
          // await this.studentService.delete(id);
        } catch (error) {
          // TODO: implement error handling on UI
          console.error('Error handling not implemented');
          throw error;
        }
      });
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
