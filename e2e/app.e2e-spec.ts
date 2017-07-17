import { InnerCircleAppPage } from './app.po';

describe('inner-circle-app App', () => {
  let page: InnerCircleAppPage;

  beforeEach(() => {
    page = new InnerCircleAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
