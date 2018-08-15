import 'babel-polyfill';
import { PLATFORM } from "aurelia-pal";

import environment from './environment';
import '../static/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';

export async function configure(aurelia) {
	aurelia.use.standardConfiguration();
	aurelia.use.feature(PLATFORM.moduleName('resources/index'));
	aurelia.use.feature(PLATFORM.moduleName('features/authentication/index'));
	if (__DEBUG__) {
		aurelia.use.developmentLogging();
		console.info('__DEBUG__ : ' + __DEBUG__);
		console.info('developmentLogging');
	}

	if (environment.debug) {
		console.info('environment debug is active ' + __DEBUG__ + ' - '+ environment.debug)
	}
	await aurelia.start();
	await aurelia.setRoot(PLATFORM.moduleName('app'));
}