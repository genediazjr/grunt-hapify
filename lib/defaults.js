'use strict';

const Hoek = require('hoek');

module.exports = function(options) {

    const configs = {
        inert: require('inert'),
        vision: require('vision'),
        good: require('good')
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

    return {
        keepalive: false,
        server: { debug: false },
        connection: {
            port: 9090,
            routes: { cors: true }
        },
        plugins: plugins,
        routes: []
    };
};
