/**
 *
 */
require('babel-polyfill');
require('babel-core/register')({
    presets: ['es2015', 'stage-3']
});
var http = require('http');


const Koa = require('koa')
const app = new Koa();
var debug = require('debug')('demo:server');


const middleware = require('../middleware');
const router = require('../router');

middleware(app);
// routes
router(app);

let port = '8081';

/**
 * Create HTTP server.
 */
let server = http.createServer(app.callback());

server.listen(port, function() {
    console.log('listening on:' + port);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
