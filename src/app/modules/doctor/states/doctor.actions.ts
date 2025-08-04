// doctor.actions.ts
export class DoctorLogin {
  static readonly type = '[Doctor] Login';
  constructor(public payload: { username: string; password: string }) {}
}

export class DoctorLoginSuccess {
  static readonly type = '[Doctor] Login Success';
  constructor(public token: string) {}
}

export class DoctorLoginFailure {
  static readonly type = '[Doctor] Login Failure';
  constructor(public error: string) {}
}
