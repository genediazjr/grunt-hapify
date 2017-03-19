'use strict';

const Hapi = require('hapi');
const Util = require('util');
const Path = require('path');
const Hoek = require('hoek');
const Glob = require('glob');
const Assert = require('assert');

const internals = {

    /**
     * Builds array of node modules from filepath using `Glob`
     *
     * @params {String} filepath - Path to search
     * @returns {Array} Array of modules
     */
    getModules: (filepath) => {

        const modules = [];
        const _filepath = Path.resolve(process.cwd(), filepath);
        const paths = Glob.sync(_filepath);

        paths.forEach((p) => {

            const _module = require(p);
            Hoek.merge(modules, _module);
        });

        return modules;
    },

    /**
     * Returns array of configurations for configuring
     * Hapi route and plugin configs (so meta)
     *
     * @param {String|Array|Object|Function} - config - A filepath, an array of configs, a config object, or a config function
     * @returns {Array} Array of configs
     */
    buildConfigArray: (config, build, from) => {

        Assert(config !== undefined, 'Config cannot be undefined');
        Assert(config !== null, 'Config cannot be null');

        build = build || [];

        // Only 1 check should match
        let resolved = false;


        if (!resolved && Util.isArray(config)) {
            config.forEach((conf) => {

                const configs = internals.buildConfigArray(conf);
                Hoek.merge(build, configs);
            });

            resolved = true;
        }

        if (!resolved && Util.isString(config)) {

            build.concat(internals.getModules(config));
            resolved = true;
        }

        if (!resolved && (Util.isFunction(config) || Util.isObject(config))) {

            build.push(config);
            resolved = true;
        }
console.log(from);
console.log(Hoek.flatten(build));
        // Create a flat array to make Hapi happy
        return Hoek.flatten(build);
    }
};

module.exports = function (options, from) {

    options = options || {};

    const server = new Hapi.Server(options.server);

    server.connection(options.connection);

    if (options.plugins) {

        const plugins = internals.buildConfigArray(options.plugins, [], from);
        server.register(plugins);
    }

    if (options.views) {

        server.views(options.views);
    }

    if (options.routes) {

        const routes = internals.buildConfigArray(options.routes);
        server.route(routes);
    }

    return server;
};
