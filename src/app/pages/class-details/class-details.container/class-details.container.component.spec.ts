import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassService } from '../../class/services/class.graphql.service';
import { ActivatedRoute } from '@angular/router';
import { ClassDetailsContainerComponent } from './class-details.container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs-compat';

describe('ClassDetailsContainerComponent', () => {
  let component: ClassDetailsContainerComponent;
  let classServiceMock: Partial<ClassService>;
  let fixture: ComponentFixture<ClassDetailsContainerComponent>;
  const mockedClass = {
    data: {
      classById: {
        _id: '5b217b030825622c97d3757f',
        level: 'א',
        number: 1,
        name: 'טיטאן',
      },
    },
  };
  beforeEach(async(() => {
    classServiceMock = {
      classById: jest.fn().mockReturnValue(Promise.resolve(mockedClass)),
    };
    TestBed.configureTestingModule({
      declarations: [ClassDetailsContainerComponent],
      providers: [
        { provide: ClassService, useValue: classServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '5b217b030825622c97d3757f' } },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
    const schedule = component.buildScheduleFromTimeslots(2, 2, []);

    expect(schedule.length).toBe(2);
    expect(schedule[0].length).toBe(2);
  });

  it('should create matrix with lesson in 0,0 place given days and hours and timeslot array[1]', () => {
    const schedule = component.buildScheduleFromTimeslots(2, 2, [
      {
        index: '10',
        lesson: {
          _id: 'someId',
          icon: 'some icon',
          title: 'some title',
        },
      },
    ]);

    expect(schedule[1][0]).toEqual({
      _id: 'someId',
      icon: 'some icon',
      title: 'some title',
    });
    expect(schedule.length).toBe(2);
    expect(schedule[0].length).toBe(2);
  });
});
