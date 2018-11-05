import { Selector, t } from 'testcafe';

export default class MapPage {
  static url = '/map';

  mapPageTitle: Selector;
  floorTitle: Selector;
  floorTitleSelector: Selector;
  floorLocationListNames: Selector;
  floorLocationSymbolNames: Selector;
  floorList: string[];
  locationsList: string[];
  floorOptionText: Selector;
  floorToggle: Selector;

  constructor() {
    this.mapPageTitle = Selector('app-map-view div div h2');
    this.floorTitle = Selector('.mat-select-value-text span');
    this.floorLocationListNames = Selector('div .mat-list-item-content');
    this.floorLocationSymbolNames = Selector("div [id^='mat-input-']");
    this.floorTitleSelector = Selector('.mat-select-arrow-wrapper .mat-select-arrow');
    this.floorList = new Array();
    this.locationsList = new Array();
    this.floorOptionText = Selector('.lessons-option .mat-option-text');
    this.floorToggle = Selector('.mat-slide-toggle-input');
  }

  /**
   * @author drieur
   * click on a floor on the floor list. put floor name as string.
   * @param floor
   * @returns {Promise<void>}
   */
  async selectAFloor(floor) {
    await t.click(this.floorTitleSelector);
    const floorLocation = this.floorList.indexOf(floor);
    await t.click(this.floorOptionText.nth(floorLocation));
  }

  /**
   * get full locations list from floors
   * get floor name
   * @param floorsList
   * @returns {Promise<string[]>}
   */
  async getFullLocationsList() {
    await this.getFloorList();

    // on all floors
    let locSymbol;

    let index = 0;
    for (let i = 0; i <= this.floorList.length; i++) {
      await this.selectAFloor(this.floorList[i]);
      const numBerOfLocationsOnFloor = await this.floorLocationListNames.count;
      // get all locations
      for (let j = 0; j < numBerOfLocationsOnFloor * 2; j++) {
        locSymbol = await this.floorLocationSymbolNames.nth(j).getAttribute('ng-reflect-value');
        this.locationsList[index++] = locSymbol;
      }
    }
    return this.locationsList;
  }

  /**
   * @author drieur
   * get full floor list
   * @returns {Promise<string[]>}
   */
  async getFloorList() {
    let index = 3;

    for (; index >= 0; index--) {
      await t.click(this.floorTitleSelector);
      await t.click(this.floorOptionText.nth(index));
      this.floorList[index] = await this.floorOptionText.nth(index).textContent;
    }

    return this.floorList;
  }
}
