/* eslint-disable no-process-env, no-process-exit, no-magic-numbers, func-style */

import 'babel-polyfill';
import App from '../app';
import Server from '../server';
import * as Services from '../services';
import log from '@branch-app/log';
import { readFileSync } from 'fs';

// Import config
const defaultPort = 3000;
const config = JSON.parse(readFileSync('./config.development.json'));

const run = async () => {
	const options = {
		port: config.port || defaultPort,
	};

	const db = await Services.Database.connect({ uri: config.mongodb });
	const app = new App(config, db);
	const server = new Server(app, options);

	await server.setup();
	server.run();
};

(async () => {
	try {
		await run();
	} catch (error) {
		console.log(error.stack);

		log.fatal('start_failed', [error]);
	}
})();
