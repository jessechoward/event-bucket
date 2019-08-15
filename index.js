if (!process.env.NODE_ENV || ['development', 'test', 'ci'].includes(process.env.NODE_ENV)) {
	require('dotenv').config();
}
const packageConfig = require('./package.json');
if (!process.env.APP_NAME) {
	process.env.APP_NAME = packageConfig.name;
}
if (!process.env.APP_VERSION) {
	process.env.APP_VERSION = packageConfig.version;
}
const express = require('express');
const requestId = require('express-request-id')();
const helmet = require('helmet')();
const app = express();

// body parsing
app.use(express.json(), express.urlencoded({extended: true}));
// request ID and security headers
app.use(requestId, helmet);
/**
 * ToDo: add route logging and metrics middleware
 */
// routes
app.use(require('./routes'));

// wrap the app and server
const server = require('./server')(app);
module.exports = server;
