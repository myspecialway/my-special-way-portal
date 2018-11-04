import { Selector, t } from 'testcafe';

export default class MapPage {
  static url = '/map';

  mapPageTitle: Selector;
  floorTitle: Selector;
  floorTitleSelector: Selector;
  floorLocationListNames: Selector;
  floorLocationSymbolNames: Selector;
  floorList: string[];
  locationsList: Map<string, [boolean, string, string]>;
  floorOptionText: Selector;
  floorToggle: Selector;

  constructor() {
    this.mapPageTitle = Selector('app-map-view div div h2');
    this.floorTitle = Selector('.mat-select-value-text span');
    this.floorLocationListNames = Selector('div .mat-list-item-content');
    this.floorLocationSymbolNames = Selector("div [id^='mat-input-'] ");
    this.floorTitleSelector = Selector('.mat-select-arrow-wrapper .mat-select-arrow');
    this.floorList = new Array();
    this.locationsList = new Map<string, [boolean, string, string]>();
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
    console.log(floorLocation);

    await t.click(this.floorOptionText.nth(floorLocation));
    console.log('floor selected   on location' + floorLocation);
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

    for (let i = 0; i < this.floorList.length; i++) {
      await this.selectAFloor(this.floorList[i]);
      debugger;
      const numBerOfLocationsOnFloor = await this.floorLocationListNames.count;
      // get all locations
      for (let j = 2; j <= numBerOfLocationsOnFloor; j++) {
        const checkedStatus = (await this.floorToggle.nth(j).getAttribute('Checked')) === 'true';
        let locSymbol;
        let locName;
        console.log(checkedStatus);
        console.log((j % 2 === 0) + 'result of comparison');

        if (j % 2 === 0) {
          locSymbol = await this.floorLocationSymbolNames.nth(j).innerText;
          console.log(locSymbol);
        } else {
          locName = await this.floorLocationSymbolNames.nth(j).innerText;

          console.log(locName);
        }
        this.locationsList.set(this.floorList[i], [checkedStatus, locSymbol, locName]);
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
      console.log(index + ' index');
      await t.click(this.floorTitleSelector);
      await t.click(this.floorOptionText.nth(index));
      console.log((await this.floorOptionText.nth(index).textContent) + 'text content');
      this.floorList[index] = await this.floorOptionText.nth(index).textContent;
    }

    return this.floorList;
  }
}
