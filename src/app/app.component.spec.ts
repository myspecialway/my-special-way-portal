import { AppComponent } from './app.component';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

class MockDomSanitizer {
  bypassSecurityTrustResourceUrl() {}
}

describe('dashboard component', () => {
  let sanitizerSpy: jasmine.Spy;
  let iconRegSpy: jasmine.Spy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: DomSanitizer, useClass: MockDomSanitizer }, MatIconRegistry],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });

    beforeEach(() => {
      const sanitier = TestBed.get(DomSanitizer);
      const iconRegistry = TestBed.get(MatIconRegistry);

      sanitizerSpy = spyOn(sanitier, 'bypassSecurityTrustResourceUrl');
      iconRegSpy = spyOn(iconRegistry, 'addSvgIcon');
    });
  });

  it('should register svg icon', () => {
    expect(sanitizerSpy).toHaveBeenCalled();
    expect(iconRegSpy).toHaveBeenCalled();
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toMatchSnapshot();
  });
});
