import {inject} from 'aurelia-framework';
import {AuthService} from './services/auth-service';
import {Router} from 'aurelia-router';

@inject(Router,AuthService)
export class Login{

    constructor(router, authService){
        this.authService = authService;
        this.router = router;
    }

    activate() {
        if (this.authService.isLoggedIn()) {
            console.log('active : navigate to home');
            this.router.navigateToRoute('welcome');
        }
    }
    logIn(){
        this.authService.logIn(this.userName, this.password).then(tokenResult => {
            if(tokenResult.success){
                this.errorMessage = "";
                this.router.navigateToRoute('home');
            }
            else{
                this.errorMessage = tokenResult.message;
            }
        });
    }
}