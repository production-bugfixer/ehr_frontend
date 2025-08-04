// doctor.state.ts
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { DoctorLogin, DoctorLoginSuccess, DoctorLoginFailure } from './doctor.actions';
import { DoctorLoginStateModel } from './doctor.model';
import { Injectable } from '@angular/core';
import { AuthService } from '../service/AuthService';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@State<DoctorLoginStateModel>({
  name: 'doctorLogin',
  defaults: {
    isLoggedIn: false,
    token: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class DoctorLoginState {

  constructor(private authService: AuthService) {}

  @Selector()
  static isLoggedIn(state: DoctorLoginStateModel): boolean {
    return state.isLoggedIn;
  }

  @Selector()
  static isLoading(state: DoctorLoginStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: DoctorLoginStateModel): string | null {
    return state.error;
  }

  @Action(DoctorLogin)
  login(ctx: StateContext<DoctorLoginStateModel>, action: DoctorLogin) {
    ctx.patchState({ loading: true, error: null });

    return this.authService.doctorLogin(action.payload).pipe(
      tap((result: { token: string }) => {
        ctx.dispatch(new DoctorLoginSuccess(result.token));
      }),
      catchError(err => {
        ctx.dispatch(new DoctorLoginFailure('Invalid credentials'));
        return of(err);
      })
    );
  }

  @Action(DoctorLoginSuccess)
  loginSuccess(ctx: StateContext<DoctorLoginStateModel>, action: DoctorLoginSuccess) {
    ctx.patchState({
      isLoggedIn: true,
      token: action.token,
      loading: false,
      error: null
    });
  }

  @Action(DoctorLoginFailure)
  loginFailure(ctx: StateContext<DoctorLoginStateModel>, action: DoctorLoginFailure) {
    ctx.patchState({
      isLoggedIn: false,
      token: null,
      loading: false,
      error: action.error
    });
  }
}
