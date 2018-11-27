import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PasswordValidatorDirective } from './password-validator.directive';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';

@Component({
  template:
    '<form #form="ngForm">' + '<input name="field" appPassword #fieldModel="ngModel" [(ngModel)]="field">' + '</form>',
})
export class TestComponent {
  field: string;
}

describe('password validator directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientModule, ApolloModule],
      declarations: [PasswordValidatorDirective, TestComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }, PasswordValidatorDirective],
    }).compileComponents();
  }));

  afterEach(() => {
    if (fixture) fixture.destroy();
  });

  it('should invalidate password field if it is less than 8 chars', async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = 'abcd123';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(false);
    });
  });

  it('should invalidate password field if it is not including numbers', async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = 'badPassword';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(false);
    });
  });

  it('should invalidate password field if it is not including letters', async () => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = '9517532846';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(false);
    });
  });

  it('should not invalidate field if it is OK', async(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.field = 'g0odPassw0rd';
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const fieldModel = fixture.debugElement.query(By.css('input[name=field]')).references['fieldModel'];
      expect(fieldModel.valid).toBe(true);
    });
  }));
});
