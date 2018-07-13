import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from "aurelia-framework";

import { OAuthTokenService } from './oauth-token-service';
import oauthConstants from './oauth-constants';

@inject(EventAggregator, OAuthTokenService)
export default class OAuthInterceptor {

  constructor(eventAggregator, oauthTokenService) {
    this.eventAggregator = eventAggregator;
    this.oauthTokenService = oauthTokenService;
  }

  request(request) {
    if (request.headers.append && !request.headers.get(oauthConstants.AUTHORIZATION_HEADER)) {
      //request.headers.append(oauthConstants.AUTHORIZATION_HEADER, this.oauthTokenService.getAuthorizationHeader());
    }

    alert(request);
    return request;
  };

  response(response, request) {
 
    this.eventAggregator.publish(oauthConstants.INVALID_TOKEN_EVENT, response);

    this.handleRequestError(response, request);
    return response;
  };

  responseError(response, request) {
    this.handleRequestError(response, request);
    return Promise.reject(response);
  };

  handleRequestError(response, requestMessage) {
    // Support for fetch-client
    if (response && response.status && response.status === 401 &&
      !requestMessage.tokenExpired && !this.oauthTokenService.isTokenValid()) {
      response.tokenExpired = true;
      this.eventAggregator.publish(oauthConstants.INVALID_TOKEN_EVENT, response);
    }
  }
}
