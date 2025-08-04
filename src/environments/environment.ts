export const environment = {
  production: false,
  baseApiUrl: 'http://localhost:2000/',

  authEndpoints: {
    doctor: '/auth/v1/doctor',
    patient: '/auth/v1/patient',
    nurse: '/auth/v1/nurse',
    technician: '/auth/v1/technician',
    admin: '/auth/v1/adminstaff',
    external: '/auth/v1/ex'
  },
  public:{
     forgetPasswordVerification:'/forgort-password/request',
     reset:'/forgort-password/reset'
  }
};
