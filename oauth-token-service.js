import { inject } from "aurelia-framework";

import LocalStorageService from './local-storage-service';
import oauthConstants from './oauth-constants';

@inject(LocalStorageService)
export class OAuthTokenService {

  constructor(localStorageService) {
    this.localStorageService = localStorageService;
  }

  getToken() {
    return this.localStorageService.get(oauthConstants.OAUTH_STORAGE_JWT_KEY);
  }

  removeToken() {
    this.localStorageService.remove(oauthConstants.OAUTH_STORAGE_JWT_KEY);
  }

  getAuthorizationHeader() {
    let token = this.getToken();
    if (token) {
      return `${oauthConstants.OAUTH_TOKEN_TYPE} ${token}`;
    }

    return '';
  };
}
