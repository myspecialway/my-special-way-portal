import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonActiveTimeComponent } from './non-active-time.component';

describe('NonActiveTimeComponent', () => {
  let component: NonActiveTimeComponent;
  let fixture: ComponentFixture<NonActiveTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonActiveTimeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonActiveTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
