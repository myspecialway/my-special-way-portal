import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassDetailsViewComponent } from './class-details.view.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateCustomLoader } from '../../../../mocks/translate.stub';

const beforeEachAsync = async () => {
  TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateCustomLoader,
        },
      }),
    ],
    declarations: [ClassDetailsViewComponent],
    providers: [ScheduleService],
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
};

describe('ClassDetailsComponent with class info', () => {
  let fixture: ComponentFixture<ClassDetailsViewComponent>;
  let component: ClassDetailsViewComponent;
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsViewComponent);
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
  let fixture: ComponentFixture<ClassDetailsViewComponent>;
  let component: ClassDetailsViewComponent;
  beforeEach(beforeEachAsync);

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassDetailsViewComponent);
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
