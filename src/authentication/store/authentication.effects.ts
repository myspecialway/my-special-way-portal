import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { AuthenticationAction, GetTokenFromStore } from './authentication.actions';
import { AuthenticationService } from '../../app/services/authentication/authentication.service';

@Injectable()
export class AuthenticationEffects {
  constructor(private actions$: Actions, private authenticationService: AuthenticationService) {}

  @Effect()
  getToken$ = this.actions$.ofType<GetTokenFromStore>(AuthenticationAction.GET_TOKEN_FROM_STORE).map((action) => {
    const token = this.authenticationService.getTokenFromLocalStore();
    if (!token) {
      return null;
    }
  });
}
