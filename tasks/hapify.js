'use strict';

const Hapify = require('..');


module.exports = function (grunt) {

    grunt.registerMultiTask('hapify', 'Start a hapi server', function () {

        const options = this.options({
            plugins: null,
            keepalive: false,
            server: { debug: false },
            connection: {
                port: 9090,
                routes: { cors: true }
            },
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
