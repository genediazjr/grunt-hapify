'use strict';

const plugin1Mod1 = (server, options, next) => {
    next();
};

plugin1Mod1.attributes = {
    name: 'plugin1Mod1'
};

const plugin2Mod2 = (server, options, next) => {
    next();
};

plugin2Mod2.attributes = {
    name: 'plugin1Mod2'
};

module.exports = [plugin1Mod1, plugin2Mod2];
