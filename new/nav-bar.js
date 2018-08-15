import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class NavBar{
	@bindable router;
	constructor(router){
		this.router = router;
		console.log(this.router);
	}

	bind(){
		console.log('nav-bar Element - bind');
	}
}