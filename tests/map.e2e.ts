import LoginPage from './pageobjects/login.po';
import { testEnvironment } from './config/config';
import MapPage from './pageobjects/map-details.po';

const loginPage = new LoginPage();
const mapPage = new MapPage();

fixture(`Map tests`)
  .page(testEnvironment.feUrl)
  .before(async (t) => {
    await loginPage.loginAsPrinciple();
    await mapPage.getFloorList();
    await mapPage.getFullLocationsList();
  });
