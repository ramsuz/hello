import {inject} from 'aurelia-framework';
import OAuthTokenService from './oauth-token-service';

@inject(OAuthTokenService)
export class OAuthService {

  constructor(oauthTokenService) {
    this.oauthTokenService = oauthTokenService;
  }

  isAuthenticated() {
    let token = this.oauthTokenService.getToken();

    if (token) return true;

    return false;
  };

  logout() {
    this.oauthTokenService.removeToken();

    //router navigate to logout page
  };

  getUser() {
    
  }
}
