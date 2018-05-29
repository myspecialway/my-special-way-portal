import { AppPage } from './app.po';

describe('msw-client App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Login message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Login');
  });
});
