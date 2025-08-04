export interface DoctorLoginStateModel {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}