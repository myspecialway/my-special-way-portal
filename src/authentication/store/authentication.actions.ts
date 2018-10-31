import { Action } from '@ngrx/store';

export enum AuthenticationAction {
  GET_TOKEN_FROM_STORE = '[Auth} get token from store',
}

export class GetTokenFromStore implements Action {
  type = AuthenticationAction.GET_TOKEN_FROM_STORE;
}

export type AuthenticationActions = GetTokenFromStore;
