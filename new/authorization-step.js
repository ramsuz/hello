import {Redirect} from 'aurelia-router';

export class AuthorizeStep {

  constructor(authService){
    this.authService = authService;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      
      if (!this.authService.isLoggedIn()) {
        console.log('is not loggedIn');
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}