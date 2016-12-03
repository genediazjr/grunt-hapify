'use strict';


module.exports = {
    path: '/route2',
    method: 'get',
    handler: function (request, reply) {

        return reply({
            path: 'route2'
        });
    }
};
