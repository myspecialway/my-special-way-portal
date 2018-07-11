import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDetailsContainerComponent } from './class-details.container.component';
import { ClassDetailsViewComponent } from '../class-details.view/class-details.view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClassDetailsContainerComponent', () => {
  let component: ClassDetailsContainerComponent;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassDetailsContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create empty matrix of lessons given days and hours counts and empty timeslots array', () => {
    component = new ClassDetailsContainerComponent();
    const schedule = component.buildScheduleFromTimeslots(2, 2, []);

    expect(schedule.length).toBe(2);
    expect(schedule[0].length).toBe(2);
  });

  it('should create matrix with lesson in 0,0 place given days and hours and timeslot array[1]', () => {
    component = new ClassDetailsContainerComponent();
    const schedule = component.buildScheduleFromTimeslots(2, 2, [{
      index: '10',
      lesson: {
        _id: 'someId',
        icon: 'some icon',
        title: 'some title',
      },
    }]);

    expect(schedule[1][0]).toEqual({
      _id: 'someId',
      icon: 'some icon',
      title: 'some title',
    });
    expect(schedule.length).toBe(2);
    expect(schedule[0].length).toBe(2);
  });
});
