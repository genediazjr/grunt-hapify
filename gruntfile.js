'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        hapify: {
            server: {
                options: {
                    connection: {
                        port: 9090
                    },
                    routes: [
                        'test/routes/*.js',
                        {
                            path: '/foo',
                            method: 'get',
                            handler: function (request, reply) {

                                return reply('bar');
                            }
                        },
                        [
                            {
                                path: '/come',
                                method: 'get',
                                handler: function (request, reply) {

                                    return reply({
                                        get: 'some'
                                    });
                                }
                            }
                        ]
                    ]
                }
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['hapify']);
};
