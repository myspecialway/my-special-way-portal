import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
import { t, Selector } from 'testcafe';
import MapsPage from './pageobjects/maps.po';

const loginPage = new LoginPage();
const mapsPage = new MapsPage();
fixture(`Maps tests`)
  .page(testEnvironment.feUrl)
  .beforeEach(async () => {
    await loginPage.loginAsPrinciple();
    await mapsPage.navigateToMapsPage();
  });

test('clicking on send file after all fields fill', async () => {
  await mapsPage.openPopUpAddButton();
  await mapsPage.selectFile();
  await mapsPage.typeFileName('file name 1');
  await mapsPage.typeFloor('1');
  await mapsPage.clickToUploadFile();
  await mapsPage.expectPopUpToBeClosed();
});

test('clicking on cancle should close the windows', async () => {
  await mapsPage.openPopUpAddButton();
  await mapsPage.clickToClosePopUp();

  await mapsPage.expectPopUpToBeClosed();
});

test('click on send file is available if all fields fill', async () => {
  await mapsPage.openPopUpAddButton();
  await mapsPage.selectFile();
  await mapsPage.typeFileName('file name 2');
  await mapsPage.typeFloor('1');

  await t.expect(Selector('[id$="amd-send-file"]').hasAttribute('disabled')).notOk();
});

test('click on send file is unavailable because file is missing', async () => {
  await mapsPage.openPopUpAddButton();
  await mapsPage.typeFileName('file name 3');
  await mapsPage.typeFloor('1');

  await t.expect(Selector('[id$="amd-send-file"]').hasAttribute('disabled')).ok();
});

test('click on send file is unavailable because file name is missing', async () => {
  await mapsPage.openPopUpAddButton();
  await mapsPage.selectFile();
  await mapsPage.typeFloor('1');

  await t.expect(Selector('[id$="amd-send-file"]').hasAttribute('disabled')).ok();
});
