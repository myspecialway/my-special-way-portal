import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapFloorListComponent } from './map-floor-list.component';
import { ChangeDetectorRef } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { IMapBasePayload, MapEventType } from '../../../../../models/maps.file.model';

describe('MapFloorListComponent', () => {
  const communicationService = new CommunicationService();
  let component: MapFloorListComponent;
  let fixture: ComponentFixture<MapFloorListComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: CommunicationService, useValue: communicationService },
      ],
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

  it('should update floors with list tab when subscriber emit event update list', () => {
    const floors = [
      {
        id: '1',
        fileName: '1',
        floor: 1,
        isActive: false,
      } as IMapBasePayload,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
      {
        id: '3',
        fileName: '3',
        floor: 3,
        isActive: false,
      } as IMapBasePayload,
    ];
    component.floors = [];
    component.parentCommunication({ type: MapEventType.FLOOR_UPDATE_LIST, payload: floors });
    expect(component.floors).toEqual(floors);
  });

  it('should delete floor tab when subscriber emit event delete', () => {
    const floors = [
      {
        id: '1',
        fileName: '1',
        floor: 1,
        isActive: true,
      } as IMapBasePayload,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
      {
        id: '3',
        fileName: '3',
        floor: 3,
        isActive: false,
      } as IMapBasePayload,
    ];

    const nextFloor = [
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: true,
      } as IMapBasePayload,
      {
        id: '3',
        fileName: '3',
        floor: 3,
        isActive: false,
      } as IMapBasePayload,
    ];

    component.floors = floors;
    component.parentCommunication({
      type: MapEventType.MAP_DELETE,
      payload: {
        id: '1',
        next_active_id: '3',
      },
    });
    fixture.detectChanges();
    expect(component.floors).toEqual(nextFloor);
  });

  it('should delete floor tab when subscriber emit event delete', () => {
    const floors = [
      {
        id: '1',
        fileName: '1',
        floor: 1,
        isActive: true,
      } as IMapBasePayload,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
    ];

    const nextFloor = [
      {
        id: '1',
        fileName: '1',
        floor: 1,
        isActive: false,
      } as IMapBasePayload,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
      {
        id: '3',
        fileName: '3',
        floor: 3,
        isActive: true,
      } as IMapBasePayload,
    ];

    component.floors = floors;
    component.parentCommunication({
      type: MapEventType.MAP_UPLOAD,
      payload: {
        id: '3',
        fileName: '3',
        floor: 3,
        isActive: false,
      } as IMapBasePayload,
    });
    fixture.detectChanges();
    expect(component.floors).toEqual(nextFloor);
    expect(component.floors[2].isActive).toEqual(true);
  });

  it('should change emit delete event on click on trash', () => {
    spyOn(component.change, 'emit');
    const mouseEvent: Partial<MouseEvent> = {};
    const floors = [
      {
        id: '1',
        fileName: '1',
        floor: 1,
        isActive: true,
      } as IMapBasePayload,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
    ];
    // when
    component.floors = floors;
    fixture.detectChanges();
    component.onSelect(
      mouseEvent as MouseEvent,
      {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
    );

    const eventUpdate = {
      payload: {
        id: '2',
        fileName: '2',
        floor: 2,
        isActive: false,
      } as IMapBasePayload,
      type: MapEventType.MAP_SELECT,
    };
    expect(component.change.emit).toBeCalledWith(eventUpdate);
  });
});
