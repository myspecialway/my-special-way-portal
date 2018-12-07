import { AppComponent } from './app.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
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
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: DomSanitizer, useClass: MockDomSanitizer }, MatIconRegistry],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    sanitier = TestBed.get(DomSanitizer);
    iconRegistry = TestBed.get(MatIconRegistry);

    sanitizerSpy = spyOn(sanitier, 'bypassSecurityTrustResourceUrl');
    iconRegSpy = spyOn(iconRegistry, 'addSvgIcon');
  });

  it('should verify loadIcons on ngOnInit ', async () => {
    spyOn(component, 'loadIcons');
    fixture.detectChanges();
    expect(component.loadIcons).toHaveBeenCalled();
  });

  it('should register svg icon ', () => {
    component.loadIcons();
    expect(sanitizerSpy).toHaveBeenCalled();
    expect(iconRegSpy).toHaveBeenCalled();
  });

  it('should render component as described in snapshot', () => {
    //    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture).toMatchSnapshot();
  });
});
