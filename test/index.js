'use strict';

const Hapify = require('..');

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('lib', () => {

    it('returns server without options passed', (done) => {

        const server = Hapify();

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('returns server with options passed', (done) => {

        const server = Hapify({ server: { debug: false } });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('can accept functions as plugins config', (done) => {

        const plugin = function (server, options, next) {

            return next();
        };

        plugin.attributes = { name: 'example' };

        const server = Hapify({ plugins: plugin }, 'fn as conf');

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.start(() => {
console.log(server.plugins);
            expect(server.plugins.example).to.exist();
            done()
        }, 100);

    });

    it('can accept array of plugins as plugins config', (done) => {

        const plugins = require('test/plugins/plugin1');
        const server = Hapify({ plugins: plugins });


        expect(server).to.be.an.object();
        expect(server.start).to.exist();
        expect(server.plugins.plugin1Mod1).to.exist();

        return done();
    });

    it('accepts server routes', (done) => {

        const server = Hapify({
            routes: [
                {
                    path: '/test1',
                    method: 'get',
                    handler: function (req, reply) {

                        return reply('here');
                    }
                }
            ]
        });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({ url: '/test1', method: 'get'}, (response) => {

            expect(response.payload).to.equal('here');
            return done();
        });

    });

    it('accepts server glob routes', (done) => {

        const server = Hapify({
            routes: ['test/routes/*.js']
        });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('serves static files from public using inert', (done) => {

        const server = Hapify();

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({
            url: '/hapi-god.png',
            method: 'get'
        }, (response) => {

            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('serves handlebar templates', (done) => {

        // Merge default config
        const server = Hapify({
            views: {

                path: `${process.cwd()}/templates`
            },
            routes: [
                {
                    method: 'get',
                    path: '/handlebars',
                    handler: (request, reply) => {

                        reply.view('handlebars', {
                            myName: 'slim'
                        });
                    }
                }
            ]
        });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({
            url: '/handlebars',
            method: 'get'
        }, (response) => {

            expect(response.statusCode).to.equal(200);
            expect(response.payload).to.match(/slim\-shady/gi);
            done();
        });
    });
});
