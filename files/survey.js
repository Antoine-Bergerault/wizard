const firebase = require('firebase');
const main = require('./../bot.js');
const bot = main.bot;
const Discord = require('discord.js');
const DB = main.database;

const survey = function(msg, member) {
    msg.channel.send('survey: ok');
}

module.exports = survey;