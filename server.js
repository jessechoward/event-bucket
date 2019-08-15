const debug = require('debug')('server-class');
const EventEmitter = require('events').EventEmitter;

/**
 * Wrapper object around the app and server objects
 * Mostly used for making unit testing a little easier
 * without messing with the require cache
 */
class Server extends EventEmitter {
	constructor(app) {
		super();
		this._app = app;
		this.listen();
	}

	get isListening() {
		return this._server && this._server.listening;
	}

	get app() {
		return this._app;
	}

	get server() {
		return this._server;
	}

	listen() {
		// don't listen if we already are
		if (this.isListening()) {return;}

		const port = process.env.LISTEN_PORT || 8080;
		this._server = this.app.listen(port);
		this._server.on('listening', this._onListen.bind(this));
		this._server.on('error', this._onError.bind(this));
		this._server.on('close', this._onClose.bind(this));
	}

	close() {
		if (this.isListening()) {
			this._server.close();
		}
	}

	_onListen() {
		this.emit('listening');
		debug(`${process.env.APP_NAME} listening at ${this._server.address().address}:${this._server.address().port}`);
	}

	_onError(error) {
		this.emit('error', error);
		console.error(error);
	}

	_onClose() {
		this._server = null;
		this.emit('close');
		debug(`${process.env.APP_NAME} listening at ${this._server.address().address}:${this._server.address().port}`);
	}
}

module.exports = (app) => {
	return new Server(app);
};
