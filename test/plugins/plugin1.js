'use strict';

function plugin1Mod1 (server, options, next) { next();}
plugin1Mod1.attributes = { name: 'plugin1Mod1' };

function plugin2Mod2 (server, options, next) { next();}
plugin2Mod2.attributes = { name: 'plugin2Mod2' };

module.exports = [plugin1Mod1, plugin2Mod2];
