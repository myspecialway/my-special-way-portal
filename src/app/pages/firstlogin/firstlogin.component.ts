import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/services/user.service';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';

@Component({
  selector: 'app-firstlogin',
  templateUrl: './firstlogin.component.html',
  styleUrls: ['./firstlogin.component.scss'],
})
export class FirstloginComponent implements OnInit {
  model: any = {};
  formFieldOptions: FormGroup;
  userToDisplay: UserProfileStateModel;
  rememberMe: boolean;
  tokenFetchFailed = false;
  submitDisabled = true;
  matchFailed = false;
  passUpdateFailed = false;
  hidePassword = true;
  hidePasswordConfirm = true;

  @ViewChild('passwordConfirm')
  public _confirmPasswordInputEl: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    formBuilder: FormBuilder,
  ) {
    this.formFieldOptions = formBuilder.group({ hideRequired: true });

    this.route.params.subscribe(async (params) => {
      console.log('First Login with params: ', params);
      try {
        const userProfile = await this.authenticationService.firstLogin(params.token);
        if (userProfile === null) {
          this.tokenFetchFailed = true;
          return;
        }
        this.userToDisplay = userProfile;
      } catch (err) {
        this.tokenFetchFailed = true;
        console.error('Cannot get user details');
        console.log(err);
      }
    });
  }

  ngOnInit() {}

  async passChange() {
    try {
      await this.updateUserPassword(this.userToDisplay.username, this.model.password);
    } catch (err) {
      console.error(`login.component::login:: error in authentication ${err}`);
      this.passUpdateFailed = false;
    } finally {
      this.router.navigate(['/']);
    }
  }

  updateUserPassword(username: string, password: string) {
    this.userService.updateUserPassword(username, password);
  }

  onConfirmBlur() {
    if (this.model.password && this.model.passwordConfirm && this.model.password !== this.model.passwordConfirm) {
      setTimeout(() => {
        console.log('err occured');
        // this._confirmPasswordInputEl.oneTimeErrorMessage = 'Please enter the same password';
      }, 100);
      this.matchFailed = true;
    } else {
      this.matchFailed = false;
    }

    this.submitDisabled = this.matchFailed;
  }
}
