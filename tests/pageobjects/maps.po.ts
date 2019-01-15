import { Selector, t } from 'testcafe';

export default class MapsPage {
  constructor() {}

  public async navigateToMapsPage() {
    await t
      .click('[id$="navbarDropdownMenuLink0"]')
      .wait(20)
      .click('.nb-manage-maps');
  }

  public async expectPopUpToBeClosed() {
    const count = await Selector('.add-map-modal', { visibilityCheck: true }).count;
    await t.expect(count).eql(0);
  }

  public async openPopUpAddButton() {
    await t.click('[data-test-id$="add-map-button"]');
  }

  public async selectFile() {
    await t.setFilesToUpload('#amd-add-picture', ['./uploads/1.jpg']);
  }
  public async clickToClosePopUp() {
    await t.click('[id$="amd-cancel"]').wait(1000);
  }

  public async clickToUploadFile() {
    await t.click('[id$="amd-send-file"]').wait(1000);
  }
  public async typeFileName(fileName) {
    await t.typeText('#map-name', fileName);
  }
  public async typeFloor(fileName) {
    await t.typeText('#map-floor-number', fileName);
  }
}
