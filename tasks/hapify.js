'use strict';

const Hapify = require('..');
const Good = require('good');


module.exports = function (grunt) {

    grunt.registerMultiTask('hapify', 'Start a hapi server', function () {

        const options = this.options({
            keepalive: false,
            server: { debug: false },
            connection: {
                port: 9090,
                routes: { cors: true }
            },
            plugins: [{
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
            }],
            routes: [{
                path: '/',
                method: 'get',
                handler: function (req, reply) {

                    return reply('Grunt Hapify');
                }
            }]
        });

        const done = this.async();
        const keepalive = this.flags.keepalive || options.keepalive;
        const server = Hapify(options);

        server.start((err) => {

            if (err) {
                grunt.fatal(err);
            }

            if (!keepalive) {

                done();
            }
        });

        grunt.log.writeln(`Started hapi server on ${server.info.uri}`);
    });
};
