'use strict';

const Hoek = require('hoek');
const Path = require('path');

/**
 * Returns default configuration
 *
 * Implements Good squeeze, Visionary, Blipp, and Inert
 * Routes logging support, template rendering support, and static file serving.
 * Default plugin configs can be overwritten my passing:
 * `{ nameOfDefaultPlugin: { ..config } }`
 * For example: `{ visionary: { path: './assets' } }`
 */
module.exports = function (options) {

    const configs = {
        inert: require('inert'),
        vision: require('vision'),
        visionary: require('visionary'),
        good: require('good'),
        blipp: require('blipp')
    };

    configs.good.options = {
        reporters: {
            console: [{
                name: 'Squeeze',
                module: 'good-squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    };

    configs.visionary.options = {
        engines: {
            html: 'handlebars',
            jade: 'jade',
            ejs: 'ejs'
        },
        path: Path.resolve(process.cwd(), 'public')
    };

    const plugins = [];

    // Attach options to defaults to override
    // default plugin options and build plugins array
    Object.keys(configs).forEach((key) => {

        if (configs[key].options) {

            Hoek.merge(configs[key].options, options[key]);
        }
        else {

            configs[key].options = options[key];
        }

        plugins.push(configs[key]);
    });

    const betterErrors = (server, options, next) => {

        server.ext('onPreResponse', (request, reply) => {

            const { response } = request;

            if (response && response.isBoom && response.isServer) {
                const error = response.error || response.message;

                request.log(['error'], error);
                response.output.payload.stack = response.stack;
            }

            return reply.continue(response);
        });

        next();
    };

    betterErrors.attributes = {
        name: 'betterErrors'
    };

    plugins.push(betterErrors);

    const routes = [
        {
            method: 'GET',
            path: '/{file*}',
            handler: (request, reply) => {

                return reply.file(`./public/${request.params.file}`);
            }
        }
    ];

    return {

        keepalive: false,
        server: {
            debug: false
        },
        connection: {
            port: 9090,
            routes: { cors: true }
        },
        plugins: plugins,
        routes: routes
    };
};
