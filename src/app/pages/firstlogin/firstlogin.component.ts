import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/services/user.service';
import { UserProfileStateModel } from '../../apollo/state/resolvers/state.resolver';

@Component({
  selector: 'app-firstlogin',
  templateUrl: './firstlogin.component.html',
  styleUrls: ['./firstlogin.component.scss'],
})
export class FirstloginComponent implements OnInit {
  formFieldOptions: FormGroup;
  userToDisplay: UserProfileStateModel;
  rememberMe: boolean;
  loginFailed = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    this.route.params.subscribe(async (params) => {
      console.log('First Login with params: ', params);
      try {
        const userProfile = await this.authenticationService.firstLogin(params.token);
        if (userProfile === null) return;
        this.userToDisplay = userProfile;
        console.log(`Retreived: `, userProfile);
      } catch (err) {
        console.error('Cannot get user details');
        console.log(err);
      }
    });
  }

  ngOnInit() {}

  updateUserPassword(username: string, password: string) {
    this.userService.updateUserPassword(username, password);
  }
}
