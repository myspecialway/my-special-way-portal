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
  let sanitier: DomSanitizer;
  let iconRegistry: MatIconRegistry;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: DomSanitizer, useClass: MockDomSanitizer }, MatIconRegistry],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    sanitier = TestBed.get(DomSanitizer);
    iconRegistry = TestBed.get(MatIconRegistry);

    sanitizerSpy = spyOn(sanitier, 'bypassSecurityTrustResourceUrl');
    iconRegSpy = spyOn(iconRegistry, 'addSvgIcon');
  });

  it('should register svg icon for male face', () => {
    iconRegistry.addSvgIcon(`male_face`, sanitier.bypassSecurityTrustResourceUrl('../assets/icon/male.svg'));
    expect(sanitizerSpy).toHaveBeenCalled();
    expect(iconRegSpy).toHaveBeenCalled();
  });

  it('should register svg icon for female face', () => {
    iconRegistry.addSvgIcon(`male_face`, sanitier.bypassSecurityTrustResourceUrl('../assets/icon/female.svg'));
    expect(sanitizerSpy).toHaveBeenCalled();
    expect(iconRegSpy).toHaveBeenCalled();
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toMatchSnapshot();
  });
});
