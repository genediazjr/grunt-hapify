# grunt-hapify [![Build Status](https://travis-ci.org/genediazjr/grunt-hapify.svg?branch=master)](https://travis-ci.org/genediazjr/grunt-hapify)

> Start a [hapi](http://hapijs.com) server

Includes console logging plugin through [good](https://github.com/hapijs/good)[-console](https://github.com/hapijs/good-console).

Note that this server only runs as long as grunt is running. Once grunt's tasks have completed, the web server stops. This behavior can be changed with the [keepalive](#keepalive) option.

This task was designed to be used in conjunction with another task that is run immediately afterwards, like the [grunt-contrib-watch plugin](https://github.com/gruntjs/grunt-contrib-watch) `watch` task.

_You can run this task with the `grunt hapify` command._

## Install
```
$ npm install --save-dev grunt-hapify
```

## Usage
```js
grunt.loadNpmTasks('grunt-hapify');

grunt.initConfig({

    hapify: {
        server: {
            options: {
                keepalive: true, // set to false if in conjunction with watch

                // Override default port / Hapi `connection` object
                connection: {
                    port: 9002
                },

                // Override default plugin options
                visionary: {
                    engine: {
                        tag: 'hapi-riot'
                    }
                    path: '/path/to/views'
                },

                // Override default plugin options
                good: {

                    myHTTPReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ error: '*' }]
                    }, {
                        module: 'good-http',
                        args: ['http://prod.logs:3000', {
                            wreck: {
                                headers: { 'x-api-key': 12345 }
                            }
                        }]
                    }]
                },

                // Add new routes
                routes: [

                    // File path accepted
                    'routes/*.js',

                    // Array of file paths accepted
                    ['routes/*.js', 'more-routes/**/*.js'],

                    // Path object accepted
                    { path: '/foo', method: 'get', handler: (request, reply) => { reply('bar'); }},

                    // Array of path objects accepted
                    [{ path: '/come', method: 'get', handler: (request, reply) => { reply('some'); }}]
                ],

                // Add new plugins
                plugins: [

                    // File path accepted
                    'plugins/*.js',

                    // Array of file paths accepted
                    ['plugins/*.js', 'more-plugins/**/*.js'],

                    // Plugin function accepted
                    require('Nes'),

                    // Array of path objects accepted
                    [require('Joi'), require('hapi-auth-basic')]
                ]
            }
        }
    }
});

grunt.registerTask('default', ['hapify']);
```

### Defaults

Default plugins are Good, Visionary, Blipp, and Inert.
This gives us routes logging support, template rendering support, and static file serving.
Default plugin configs can be overwritten my passing: `{ nameOfDefaultPlugin: { ..config } }`
For example: `{ visionary: { path: './assets' } }`

## Options

### keepalive
Type: `Boolean`
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops. This option changes that behavior.

### server
Type: `Object`
Default: `{ debug: false }`

Options used to initialize the hapi serve (`new Hapi.Server(<server>)`). <br>
See hapi [server options](http://hapijs.com/api#new-serveroptions) for more info

### connection
Type: `Object`
Default: `{ port: 9090, routes: { cors: true } }`

Options used to start a connection (`server.connection(<connection>)`). <br>
See hapi [connection options](http://hapijs.com/api#serverconnectionoptions) for more info.

### routes
Type: `Array`
Default: `{ path: '/', method: 'get', handler: function (req, rep) { return rep('Grunt Hapify'); } }`

Server routes to load on the server (`server.route(<routes>)`). <br>
See hapi [routes](http://hapijs.com/api#serverrouteoptions) for more info.

### plugins
Type: `Array`
Default: `Good Plugin`

Hapi plugins to load on the server (`server.register(<plugins>)`). <br>
See hapi [plugins](http://hapijs.com/api#serverregisterplugins-options-callback) for more info.

## Todo
- Support Livereload

## Done
- Serve static files using inert
- Render templates using vision

## Contributing
* Include 100% test coverage.
* Follow the [Hapi coding conventions](http://hapijs.com/styleguide)
* Submit an issue first for significant changes.
