import { AuthenticationActions, AuthenticationAction } from './authentication.actions';
import { AuthenticationState } from './authentication.state';

export function authenticationReducer(state = new AuthenticationState(), action: AuthenticationActions) {
  switch (action.type) {
    case AuthenticationAction.GET_TOKEN_FROM_STORE:
      break;
    default:
      break;
  }
}
