import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFloorListComponent } from './map-floor-list.component';

describe('MapFloorListComponent', () => {
  let component: MapFloorListComponent;
  let fixture: ComponentFixture<MapFloorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapFloorListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFloorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
