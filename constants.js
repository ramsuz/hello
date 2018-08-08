export default {
  ajaxStatus: {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  },
  httpStatus: {
    ACCESS_DENIED: 401,
    FORBIDDEN: 403
  },
  oauth: {
      refreshTokenUrl: '/refreshtoken',
      storageJwtKey: 'oauth:jwtToken',
      storageUserInfo: 'oauth:userInfo'
  },
  headers: {
      jwtAuthorization: 'JwtAuthorization'
  }
};
