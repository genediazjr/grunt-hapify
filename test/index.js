'use strict';

const Hapify = require('..');

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('lib', () => {

    it('returns server without options', (done) => {

        const server = Hapify();

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('accepts server options', (done) => {

        const server = Hapify({ server: { debug: false } });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('accepts server plugins', (done) => {

        const plugin = function (server, options, next) {

            return next();
        };

        plugin.attributes = { name: 'example' };

        const server = Hapify({ plugins: plugin });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('accepts server routes', (done) => {

        const server = Hapify({
            routes: [{
                path: '/test',
                method: 'get',
                handler: function (req, reply) {

                    return reply('here');
                }
            }]
        });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });

    it('accepts server glob routes', (done) => {

        const server = Hapify({
            routes: ['test/routes/*.js']
        });

        expect(server).to.be.an.object();
        expect(server.start).to.exist();

        return done();
    });
});
