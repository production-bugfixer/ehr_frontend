export interface GlobalResponse {
  status: boolean;
  notificationMessage?: string;
  message?: string;
  errorCode?: string;
  exceptionMessage?: string;
  data?: any;
}
