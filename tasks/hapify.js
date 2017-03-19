'use strict';

const Hapify = require('..');
const Good = require('good');

const Inert = require('inert');
const Vision = require('vision');

module.exports = function (grunt) {

    grunt.registerMultiTask('hapify', 'Start a hapi server', function () {

        const options = this.options({
            keepalive: false,
            server: { debug: false },
            connection: {
                port: 9090,
                routes: { cors: true }
            },
            plugins: [
                Inert,
                Vision,
                {
                    register: Good,
                    options: {
                        reporters: {
                            console: [{
                                name: 'Squeeze',
                                module: 'good-squeeze',
                                args: [{ log: '*', response: '*' }]
                            }, {
                                module: 'good-console'
                            }, 'stdout']
                        }
                    }
                }
            ],
            routes: []
        });

        const server = Hapify(options);

        let done = () => {
        };

        if (options.keepalive) {
            done = this.async();
        }

        server.start((err) => {

            if (err) {
                grunt.fatal(err);
            }

            return done();
        });

        grunt.log.writeln(`Started hapi server on ${server.info.uri}`);
    });
};
