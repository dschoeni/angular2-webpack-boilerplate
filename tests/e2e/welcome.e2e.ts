import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('angular2-webpack-boilerplate');
  });

  it('should have a header', () => {
    expect(element(by.css('h1')).isPresent()).toEqual(true);
    expect(element(by.css('h1')).getText()).toEqual('Welcome!');
  });

  it('should have <boilerplate-app>', () => {
    expect(element(by.css('boilerplate-app')).isPresent()).toEqual(true);
  });

  it('should display font-awesome', () => {
    let subject = element(by.css('.fa-check')).isPresent();
    expect(subject).toEqual(true);
  });

});
