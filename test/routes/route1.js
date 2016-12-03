'use strict';


module.exports = [
    {
        path: '/route1',
        method: 'get',
        handler: function (request, reply) {

            return reply('route1');
        }
    }
];
