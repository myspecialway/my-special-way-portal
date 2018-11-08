import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { of } from 'rxjs/observable/of';
import { UniqueUsernameValidatorDirective } from './unique-username-validator.directive';
import { PagesModule } from '../pages/pages.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';

@Component({
  template:
    '<form #form="ngForm">' +
    '<input name="field" appUniqueUsername #fieldModel="ngModel" [(ngModel)]="field">' +
    '</form>',
})
export class TestComponent {
  field: string;
}

describe('unique username validator directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let authServiceMock: Partial<AuthenticationService>;

  beforeEach(() => {
    authServiceMock = {
      checkUsernameUnique: jest.fn(),
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientModule, ApolloModule],
      declarations: [UniqueUsernameValidatorDirective, TestComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        AuthenticationService,
        UniqueUsernameValidatorDirective,
      ],
    }).compileComponents();
  }));

  afterEach(() => {
    if (fixture) fixture.destroy();
  });

  it('should invalidate field if it is not unique', async () => {
    (authServiceMock.checkUsernameUnique as jest.Mock).mockImplementationOnce(() => {
      return of(false);
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = 'taken';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(false);
    });
  });

  it('should not invalidate field if it is unique', async(() => {
    (authServiceMock.checkUsernameUnique as jest.Mock).mockImplementationOnce(() => {
      return of(true);
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = 'unique';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(true);
    });
  }));
});
