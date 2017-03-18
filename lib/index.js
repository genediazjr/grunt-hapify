'use strict';

const Hapi = require('hapi');
const Glob = require('glob');
const Hoek = require('hoek');

const internals = {
    routes: [
        {
            method: 'GET',
            path: '/{file*}',
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    ],
    plugins: [
        require('inert')
    ],
    server: {
        connections: {
            routes: {
                files: {
                    relativeTo: './public'
                }
            }
        }
    }

};

module.exports = function (options) {

    options = options || {};

    const config = Hoek.applyToDefaults(internals.server, options.server);

    const server = new Hapi.Server({ server: config });

    server.connection(options.connection);

    const plugins = internals.plugins.concat(options.plugins);
    server.register(plugins);

    if (options.routes) {
        for (let r = 0; r < options.routes.length; ++r) {

            const route = options.routes[r];

            if (typeof route === 'string' || route instanceof String) {

                const files = Glob.sync(route);

                for (let f = 0; f < files.length; ++f) {
                    internals.routes.push(require(`${process.cwd()}/${files[f]}`));
                }
            }
            else {
                internals.routes.push(route);
            }
        }
    }

    server.route(internals.routes);

    return server;
};
