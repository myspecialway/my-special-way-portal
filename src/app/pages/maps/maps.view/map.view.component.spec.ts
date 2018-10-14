import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapViewComponent } from './map.view.component.ts';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ScheduleService } from '../../../services/schedule/schedule.service';

const beforeEachAsync = async () => {
  TestBed.configureTestingModule({
    declarations: [MapViewComponent],
    providers: [ScheduleService],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
};

describe('ClassDetailsComponent with class info', () => {
  let fixture: ComponentFixture<MapViewComponent>;
  let component: MapViewComponent;
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    component.name = 'פטל';
    component.grade = 'a';
    component.shouldShowClassInfo = true;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});

describe('ClassDetailsComponent without class info', () => {
  let fixture: ComponentFixture<MapViewComponent>;
  let component: MapViewComponent;
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    component.name = 'פטל';
    component.grade = 'a';
    component.shouldShowClassInfo = false;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
