import { browser, by, element } from 'protractor';

describe('Example Component', () => {

  beforeEach(() => {
    browser.get('/component');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('angular2-webpack-boilerplate');
  });

  it('should have a header', () => {
    expect(element(by.css('h1')).isPresent()).toEqual(true);
    expect(element(by.css('h1')).getText()).toEqual('Example Page');
  });

  it('should display text', () => {
    expect(element(by.css('p')).getText()).toEqual('This is a routed example component, contained in a module.');
  });


});
