import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionCleaner } from '../../../decorators/SubscriptionCleaner.decorator';
import { MatTableDataSource } from '@angular/material';
import { BlockedSection } from '../../../models/BlockedSection.model';

const mockedData: BlockedSection[] = [
  {
    blockedReason: 'Reason 1',
    fromPoint: { latitude: 1, longitude: 2, floor: 6 },
    toPoint: { latitude: 11, longitude: 22, floor: 66 },
  },
  {
    blockedReason: 'Reason 2',
    fromPoint: { latitude: 1, longitude: 2, floor: 6 },
    toPoint: { latitude: 11, longitude: 22, floor: 55 },
  },
  {
    blockedReason: 'Reason 3',
    fromPoint: { latitude: 1, longitude: 2, floor: 6 },
    toPoint: { latitude: 11, longitude: 22, floor: 77 },
  },
  {
    blockedReason: 'Reason 4',
    fromPoint: { latitude: 1, longitude: 2, floor: 6 },
    toPoint: { latitude: 11, longitude: 22, floor: 99 },
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
  mayDeleteBlock = false;
  dataSource = mockedData;
  // poiList: any = ['מפת קומת כניסה','חצר','אולם ספורט', 'קומה שניה'];
  // activePoi: string;

  @SubscriptionCleaner()
  subCollector;

  constructor(private route: ActivatedRoute) {
    this.links = [
      { label: 'נקודות ניווט', path: '/mapsPoints', dataTestId: 'maps-points-tab' },
      { label: 'מקטאים חסומים', path: './blockedMapsPoints', dataTestId: 'blocked-maps-points-tab' },
    ];
    this.activeLink = this.links[1].label;
    // this.poiList = ['מפת קומת כניסה','חצר','אולם ספורט', 'קומה שניה'];
  }

  ngOnInit(): void {
    this.subCollector.add(
      this.route.params.subscribe((params) => {
        this.idOrNew = params.idOrNew;
      }),
    );
  }

  deleteBlock() {}
}
