import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { authenticationReducer } from './store/authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './store/authentication.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([AuthenticationEffects]),
    StoreModule.forFeature('authentication', authenticationReducer),
  ],
})
export class AuthenticationModule {}
