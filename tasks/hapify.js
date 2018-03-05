'use strict';

const Hapify = require('..');

module.exports = function (grunt) {

    grunt.registerMultiTask('hapify', 'Start a hapi server', function () {

        const options = this.options();
        const server = Hapify(options);

        let done = () => {};

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
