import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { classTestData } from './../../../../../../mocks/assets/classes.mock';
import { UserService } from './../../../services/user.service';
import { Apollo } from 'apollo-angular';
import { ClassService } from './../../../../class/services/class.graphql.service';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { UserDetailsFormComponent } from './user-details-form';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { User, UserType } from './../../../../../models/user.model';
import { Class } from '../../../../../models/class.model';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateCustomLoader } from '../../../../../../mocks/translate.stub';

describe('student component', () => {
  let dataMock: User;
  let fixture: ComponentFixture<UserDetailsFormComponent>;
  let component: UserDetailsFormComponent;
  let classServiceMock: Partial<ClassService>;

  beforeEach(async () => {
    classServiceMock = {
      getAllClasses: jest.fn().mockReturnValue(Observable.of(classTestData.classes)),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    dataMock = {
      email: 'a',
      firstname: 'a',
      lastname: 'a',
      password: 'a',
      role: UserType.PRINCIPLE,
      username: 'a',
      _id: 0,
      class: new Class(),
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateCustomLoader,
          },
        }),
      ],
      declarations: [UserDetailsFormComponent],
      providers: [FormBuilder, Apollo, UserService, { provide: ClassService, useValue: classServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(UserDetailsFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    // fixture.detectChanges();
  });

  it('should update current role and data on data @Input', () => {
    expect(component.currentRole).toBeUndefined();
    component._data = dataMock;
    // fixture.detectChanges();

    expect(component.data).toBe(dataMock);
    expect(component.currentRole).toBe(UserType.PRINCIPLE);
  });

  it('should update current role on onUserTypeChange', () => {
    component.onUserTypeChange('TEACHER');
    // fixture.detectChanges();

    expect(component.currentRole).toBe('TEACHER');
  });

  it('should reset Principle class on onUserTypeChange', () => {
    component._data = dataMock;
    expect(component.data.class).toBeInstanceOf(Class);

    component.onUserTypeChange('PRINCIPLE');
    // fixture.detectChanges();

    expect(component.data.class).toBeUndefined();
  });

  it('should emit cancel on close', () => {
    let called = false;
    component.cancel.subscribe(() => {
      called = true;
    });
    expect(called).toBeFalsy();

    component.close();

    // fixture.detectChanges();

    expect(called).toBeTruthy();
  });

  it('should trigger formSubmit form.value emission on submitForm', () => {
    let emittedValue = null;
    component.formSubmit.subscribe(() => {
      emittedValue = component.form.value;
    });
    expect(emittedValue).toBeNull();

    component.submitForm();

    expect(emittedValue).toEqual(component.form.value);
  });
});
