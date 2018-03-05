'use strict';

const Hapify = require('..');

const Path = require('path');
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

    it('accepts functions as plugins config', (done) => {

        const plugin = function (server, options, next) {

            return next();
        };

        plugin.attributes = { name: 'example' };

        const server = Hapify({ plugins: plugin });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();
        expect(server.registrations.example).to.exist();

        return done();
    });

    it('accepts array of plugins as plugins config', (done) => {

        const plugins = require('./plugins/plugin1');

        const server = Hapify({ plugins: plugins });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        expect(server.registrations.plugin1Mod1).to.exist();
        expect(server.registrations.plugin1Mod2).to.exist();

        return done();
    });

    it('accepts glob filepath string as plugins config', (done) => {

        const server = Hapify({ plugins: 'test/plugins/*.js' });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        expect(server.registrations.plugin1Mod1).to.exist();
        expect(server.registrations.plugin1Mod2).to.exist();
        expect(server.registrations.plugin2).to.exist();

        return done();
    });

    it('accepts array of glob filepath strings as plugins config', (done) => {

        const server = Hapify({ plugins: ['test/plugins/*.js'] });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        expect(server.registrations.plugin1Mod1).to.exist();
        expect(server.registrations.plugin1Mod2).to.exist();
        expect(server.registrations.plugin2).to.exist();

        return done();
    });

    it('accepts array of routes as routes config', (done) => {

        const routes = require('./routes/route1');
        const server = Hapify({ routes: routes });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({ url: '/route1', method: 'get'}, (response) => {

            expect(response.payload).to.equal('route1');
            return done();
        });
    });

    it('accepts glob filepath string as routes config', (done) => {

        const server = Hapify({ routes: 'test/routes/*.js' });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({ url: '/route1', method: 'get'}, (response) => {

            expect(response.payload).to.equal('route1');

            server.inject({ url: '/route2', method: 'get'}, (response) => {

                expect(response.payload).to.equal('route2');
                return done();
            });
        });
    });

    it('accepts array of glob filepath strings as routes config', (done) => {

        const server = Hapify({ routes: ['test/routes/*.js'] });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        server.inject({ url: '/route1', method: 'get'}, (response) => {

            expect(response.payload).to.equal('route1');

            server.inject({ url: '/route2', method: 'get'}, (response) => {

                expect(response.payload).to.equal('route2');
                return done();
            });
        });
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

    [
        { tmpl: 'handlebars', ext: 'html' },
        { tmpl: 'jade', ext: 'jade' },
        { tmpl: 'ejs', ext: 'ejs' }
    ].forEach((tmpltest) => {

        it(`serves ${tmpltest.tmpl} templates`, (done) => {

            // Merge default config
            const server = Hapify({
                visionary: {
                    path: Path.resolve(process.cwd(), 'test/templates')
                },
                routes: [
                    {
                        method: 'get',
                        path: `/${tmpltest.tmpl}`,
                        handler: (request, reply) => {

                            reply.view(`index.${tmpltest.ext}`, {
                                myName: 'slim'
                            });
                        }
                    }
                ]
            });

            expect(server).to.be.an.object();
            expect(server.start).to.exist();

            server.start((err) => {

                expect(err).to.not.exist();

                server.inject({ url: `/${tmpltest.tmpl}` }, (response) => {

                    expect(response.statusCode).to.equal(200);
                    expect(response.payload).to.match(/slim-shady/gi);

                    server.stop();
                    done();
                });
            });
        });
    });
});
