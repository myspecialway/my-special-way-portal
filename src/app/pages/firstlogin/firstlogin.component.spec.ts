import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstloginComponent } from './firstlogin.component';

describe('FirstloginComponent', () => {
  let component: FirstloginComponent;
  let fixture: ComponentFixture<FirstloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstloginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
