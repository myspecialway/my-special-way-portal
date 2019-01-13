import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { SettingService } from './services/settings.service';
import { Platform } from '@angular/cdk/platform';
import { Observable } from 'rxjs-compat';
import { settingsTestData } from '../../../mocks/assets/settings.mock';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('setting component', () => {
  let settingsServiceMock: Partial<SettingService>;

  beforeEach(async () => {
    settingsServiceMock = {
      getAll: jest.fn().mockReturnValueOnce(Observable.of(settingsTestData)),
      update: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [SettingsComponent],
      providers: [FormBuilder, SettingService, { provide: SettingService, useValue: settingsServiceMock }, Platform],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  it('should render component as described in snapshot', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    expect(fixture).toMatchSnapshot();
  });

  it('should update teachercode after get data from server', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.componentInstance.ngOnInit();
    expect(fixture.componentInstance.teachercode).toBe(1234);
  });

  it('should load settings from service on page load ', () => {
    (settingsServiceMock.getAll as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    const serviceMock = TestBed.get(SettingService);
    expect(serviceMock.getAll).toHaveBeenCalled();
  });

  it('should update settings from service on code changed ', () => {
    (settingsServiceMock.update as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({ data: { data: 1 } });
    });

    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    fixture.componentInstance._settings = {
      _id: '123',
      teachercode: 1234,
    };
    const teachercode = fixture.componentInstance.form.controls['teachercodecontrol'];
    teachercode.setValue(2222);
    fixture.componentInstance.codeChanged(2222);

    fixture.detectChanges();
    const serviceMock = TestBed.get(SettingService);
    expect(teachercode.valid).toBeTruthy();
    expect(serviceMock.update).toHaveBeenCalled();
    expect(teachercode.value).toBe(2222);
  });
});
