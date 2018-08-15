import {PLATFORM} from 'aurelia-pal';
import { AuthService } from "./services/auth-service";
import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { AuthorizeStep } from "./router-steps/authorization-step";
import 'bootstrap';

@inject(AuthService, HttpClient)
export class App {
  constructor(authService, http) {
    this.authService = authService;

    const baseUrl = "http://localhost:8333/api/";

    http.configure(config => {
      config
        .withBaseUrl(baseUrl)
        .withInterceptor(this.authService.tokenInterceptor);
    });
  }
  configureRouter(config, router) {
    config.title = 'Aurelia';

    let step = new AuthorizeStep(this.authService);

    config.addAuthorizeStep(step);

    config.map([{
        route: ['', 'welcome'],
        name: 'welcome',
        moduleId: PLATFORM.moduleName('./welcome'),
        nav: true,
        title: 'Welcome',
        settings: { icon: "book", auth: true },
        layoutViewModel: PLATFORM.moduleName('main-layout')
      },
      {
        route: ['hello'],
        name: 'hello',
        moduleId: PLATFORM.moduleName('./hello'),
        nav: true,
        title: 'Hello',
        settings: { icon: "book", auth: true },
        layoutViewModel: PLATFORM.moduleName('main-layout')
      },
      {
        route: 'login',
        name: 'login',
        moduleId: PLATFORM.moduleName('./login'),
        title: "login",
        layoutViewModel: PLATFORM.moduleName('main-layout')
        //layoutView: PLATFORM.moduleName('login-layout.html')
      }
    ]);

    this.router = router;
  }
}