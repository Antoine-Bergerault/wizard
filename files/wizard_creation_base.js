let wizard_creation_base = function(id) {
    const Discord = require('discord.js');
    const firebase = require('firebase');
    const main = require('./../bot.js');
    const DB = main.database;
    let profile = [];

    DB.source('profiles').getData(id, function(data) {
        profile = data.val();
    });

    setTimeout(base = function() {
        let defaut = {
            name: profile.account.name,
            galleons: profile.game.galleons,
            inventory: profile.game.inventory,
            home: profile.game.home,
            picture: profile.account.picture,
            quests: profile.game.quests,
            life: profile.game.life,
            active: profile.account.active,
            banned: profile.account.banned
        };

        return defaut;
    },DB.responseTime);

    return base;
}

module.exports = wizard_creation_base;