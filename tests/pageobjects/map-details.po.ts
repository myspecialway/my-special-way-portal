import { Selector, t } from 'testcafe';

export default class MapPage {
  static url = '/map';

  mapPageTitle: Selector;
  floorTitle: Selector;
  floorTitleSelector: Selector;
  floorLocationListNames: Selector;
  floorList: string[];
  locationsList: string[];

  constructor() {
    this.mapPageTitle = Selector('app-map-view div div h2');
    this.floorTitle = Selector('.mat-select-value-text span');
    this.floorLocationListNames = Selector('.mat-list-item-content .mat-input-element');
    this.floorTitleSelector = Selector('.mat-select-arrow');
    this.floorList = new Array();
    this.locationsList = new Array();
  }

  async getListOfLocationOnFloor(floor) {
    // return tempList;
  }

  async selectAFloor(floor) {}

  async getFullLocationsList(floorsList) {
    return this.locationsList;
  }

  async getFloorList() {
    return this.floorList;
  }
}
