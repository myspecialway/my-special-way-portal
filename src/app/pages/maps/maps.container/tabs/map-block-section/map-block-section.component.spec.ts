import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBlockSectionComponent } from './map-block-section.component';

describe('MapBlockSectionComponent', () => {
  let component: MapBlockSectionComponent;
  let fixture: ComponentFixture<MapBlockSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapBlockSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBlockSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
