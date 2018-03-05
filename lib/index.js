'use strict';

const Hapi = require('hapi');
const Util = require('util');
const Path = require('path');
const Hoek = require('hoek');
const Glob = require('glob');

const assert = require('assert');

const mergeDefaults = require('./defaults');

const internals = {

    /**
     * Builds array of node modules from filepath using `Glob`
     *
     * @params {String} filepath - Path to search
     * @returns {Array} Array of modules
     */
    getModules: (filepath) => {

        const modules = [];
        filepath = Path.resolve(process.cwd(), filepath);

        const paths = Glob.sync(filepath);

        paths.forEach((p) => {

            // Create module into array and flatten
            // because objects and functions will be expected
            // and cannot be merged with `const modules`
            const $module = Hoek.flatten([require(p)]);

            Hoek.merge(modules, $module);
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
    buildConfigArray: (config, build) => {

        assert(config !== undefined, 'Config cannot be undefined');
        assert(config !== null, 'Config cannot be null');

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

            Hoek.merge(build, internals.getModules(config));
            resolved = true;
        }

        if (!resolved && (Util.isFunction(config) || Util.isObject(config))) {

            build.push(config);
            resolved = true;
        }

        // Create a flat array to make Hapi happy
        return Hoek.flatten(build);
    }
};

module.exports = function (options) {

    // Accept undefined and merge default
    // configuration with grunt configuration
    options = options || {};
    options = Hoek.merge(mergeDefaults(options), options);

    // Instantiate server
    const server = new Hapi.Server(options.server);

    // Set server configs
    server.connection(options.connection);

    // Plugins and routes will always be set from defaults
    server.register(internals.buildConfigArray(options.plugins));
    server.route(internals.buildConfigArray(options.routes));

    return server;
};
