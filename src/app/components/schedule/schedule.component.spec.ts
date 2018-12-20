import { scheduleTestData } from './../../../mocks/assets/schedule.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleComponent, TimeSlotIndexes } from './schedule.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('ScheduleComponent', () => {
  let fixture: ComponentFixture<ScheduleComponent>;
  let component: ScheduleComponent;
  const mockDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
  const mockHours = ['07:30 - 08:00', '08:00 - 08:50', '08:50 - 09:30'];
  const mockSchedule = [scheduleTestData];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    component.daysLabels = mockDays;
    component.hoursLabels = mockHours;
    component.schedule = mockSchedule;
    fixture.detectChanges();
  });

  it('should match current snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('onTimeSlotDelete should prevent default and stop propagation', () => {
    const mockedEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };

    const timeSlotIndex: TimeSlotIndexes = {
      hourIndex: 1,
      dayIndex: 2,
    };

    component.timeSlotDeleted.subscribe((data) => {
      expect(data).toEqual(timeSlotIndex);
    });

    component.onTimeSlotDelete(timeSlotIndex, mockedEvent);
    expect(mockedEvent.preventDefault).toBeCalled();
    expect(mockedEvent.stopPropagation).toBeCalled();
  });
});
