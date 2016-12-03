'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Glob = require('glob');


module.exports = function (options) {

    options = options || {};

    const server = new Hapi.Server(options.server);

    server.connection(options.connection);
    server.register({
        register: Good,
        options: {
            reporters: {
                console: [{
                    name: 'Squeeze',
                    module: 'good-squeeze',
                    args: [{ log: '*', error: '*', response: '*' }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    });

    if (options.plugins) {
        server.register(options.plugins);
    }

    if (options.routes) {
        for (let r = 0; r < options.routes.length; ++r) {

            const route = options.routes[r];

            if (typeof route === 'string' || route instanceof String) {

                const files = Glob.sync(route);

                for (let f = 0; f < files.length; ++f) {
                    server.route(require(`${process.cwd()}/${files[f]}`));
                }
            }
            else {
                server.route(route);
            }
        }
    }

    return server;
};
