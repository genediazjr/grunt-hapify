'use strict';

/**
 * Server used for testing
 *
 * Run to troubleshoot errors with default configs, etc.
 * Run `nodemon server.js` to auto-restart on save
 *
 */

const Path = require('path');

const testPlugin = function (server, options, next) {

    server.route({
        path: '/plugin',
        method: 'get',
        handler: (request, reply) => {
            reply('plugin');
        }
    });

    next();
};

testPlugin.attributes = { name: 'testPlugin' };

const server = require('.')({
    visionary: {
        path: Path.resolve(process.cwd(), 'test/templates')
    },
    routes: [
        {
            path: '/',
            method: 'get',
            handler: (request, reply) => {
                reply('home');
            }
        },
        {
            method: 'get',
            path: '/handlebars',
            handler: (request, reply) => {

                reply.view('index.html', {
                    myName: 'slim'
                });
            }
        }
    ],
    plugins: [
        testPlugin
    ]
});

server.start((err) => {

    if (err) {
        throw err;
    }

    server.inject({ url: '/handlebars' }, (response) => {

        server.log(response.payload);
    });
});
