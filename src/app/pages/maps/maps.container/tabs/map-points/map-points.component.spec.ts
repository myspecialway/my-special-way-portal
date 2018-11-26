import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointsComponent } from './map-points.component';

describe('MapPointsComponent', () => {
  let component: MapPointsComponent;
  let fixture: ComponentFixture<MapPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapPointsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
