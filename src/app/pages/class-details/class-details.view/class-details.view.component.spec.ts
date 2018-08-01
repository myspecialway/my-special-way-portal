import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassDetailsViewComponent } from './class-details.view.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('ClassDetailsComponent', () => {
  let fixture: ComponentFixture<ClassDetailsViewComponent>;
  let component: ClassDetailsViewComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClassDetailsViewComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsViewComponent);
    component = fixture.componentInstance;
    component.name = 'פטל';
    component.level = 'א';
    fixture.detectChanges();
  });

  it('should match current snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
