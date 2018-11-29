import { DebugElement } from '@angular/core';
import { UserService } from '../user/services/user.service';
import { Apollo } from 'apollo-angular';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { HttpClient } from '@angular/common/http';
import { FirstloginComponent } from './firstlogin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { SessionHeaderComponent } from '../../pages/shared/session-mgmt/session-header/session-header.component';
import { SessionFooterComponent } from '../../pages/shared/session-mgmt/session-footer/session-footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

describe('First Login', () => {
  let component: FirstloginComponent;
  let fixture: ComponentFixture<FirstloginComponent>;
  let authServiceMock: Partial<AuthenticationService>;

  beforeEach(() => {
    authServiceMock = {
      firstLogin: jest.fn(),
    };
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        ApolloModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
      ],
      declarations: [FirstloginComponent, SessionHeaderComponent, SessionFooterComponent],
      providers: [FormBuilder, Apollo, UserService, AuthenticationService, HttpClient],
    }).compileComponents();

    (authServiceMock.firstLogin as jest.Mock).mockImplementationOnce(() => {
      return of(true);
    });
    fixture = TestBed.createComponent(FirstloginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture) fixture.destroy();
  });

  it('passUpdateFailed to be false', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.passUpdateFailed).toBeFalsy();
    });
  });

  it('submitDisabled to be true', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.submitDisabled).toBeTruthy();
    });
  });

  it('matchFailed to be false', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.matchFailed).toBeFalsy();
    });
  });

  it('hidePassword to be true', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hidePassword).toBeTruthy();
    });
  });

  it('hidePasswordConfirm to be true', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hidePassword).toBeTruthy();
    });
  });

  it('Password match', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      component.model.password = 'Aa123456';
      component.model.passwordConfirm = 'Aa123456';
      expect(component.matchFailed).toBeFalsy();
    });
  });

  it('Password mismatch', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      component.model.password = 'Aa123456';
      component.model.passwordConfirm = 'Bb123456';
      expect(component.matchFailed).toBeTruthy();
    });
  });

  it('PasswordConfirm is empty', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      component.model.password = 'Aa123456';
      component.model.passwordConfirm = '';
      expect(component.matchFailed).toBeTruthy();
    });
  });

  it('Submit button is disabled', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      component.model.password = 'Bb123456';
      component.model.passwordConfirm = 'Aa123456';
      const submitEL: DebugElement = fixture.debugElement.query(By.css('button.btn.btn-main'));
      expect(submitEL.nativeElement.disabled).toBe(true);
    });
  });
});
