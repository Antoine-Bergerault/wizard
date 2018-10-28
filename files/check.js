const firebase = require('firebase');
const main = require('./../bot.js');
const bot = main.bot;
const Discord = require('discord.js');
const DB = main.database;

const check = function(id, name, avatar, member, _new) {
    avatar = avatar || '';
    let profile = [];
    DB.profile(id).getData('', function(data) {
        profile = data.val();
    });

    setTimeout(function() {
        if(profile==undefined) {
            let randomCode = Math.round(Math.random() * 10000000) + "_" + id;
            let defaut = {
                site: {
                    access: randomCode,
                },

                account: {
                    name: name,
                    picture: avatar,
                    year: Date.now(),
                    yid: id,
                    active: 1,
                    banned: 0
                },
                
                game: {
                    galleons: 68,
                    inventory: '',
                    home: 'none',
                    quest: 1,
                    quests_completed: 0,
                    hp: 100,
                    xp: 0,
                    level: 1,
                    spells: "",
                    dodge: 2
                }
            };
            
            try {              
                DB.source('profiles').addData('', id, defaut);

                if(_new) member = member.user;
                member.createDM().then(channel => {
                    let embed = new Discord.RichEmbed()
                        .setTitle('Welcome to The Marauders') 
                        .setColor(0xF9B234)
                        .addField(' • begins in the Magic World : ', " to have a better experience and access all the features, login on https://the-marauders.com : \n\n ") 
                        .addField(' step 1 :', "    click on \" LOGIN \", and paste this ID : ` " + randomCode + " ` ") 
                        .addField(' step 2 :', "    ready ! you can buy items, see your stats /ratios , and setting your profile") 
                        .setFooter("We wish you a wonderful experience, The Marauders ", "https://cdn.discordapp.com/emojis/460106637026525184.png?v=1");
                
                    channel.send(embed);
                    channel.send(":warning: When you enter the server, your profile photo, your nickname and your discord ID are automatically stored in our database, for non-commercial purposes; if you do not"
                    +" agree, look at <#504635326925373470>\nIf your account was reset, please DM ドリアン#8850, thanks");
                });
                console.log('compte créé ! --> '+name);
            } catch(error) {
                console.log('euh... ya eu une erreur');
                console.log(error);
            }
        } else {
            try {
                DB.profile(id).updateData('account/picture', avatar);
                let xp = profile.game.xp;
                level = 1;

                while(Math.pow(level,2.3)*10<xp) {
                    level++;
                }

                DB.profile(id).updateData('game/level', level);
            } catch(error) {
                console.log(error);
            }
        }
    },DB.responseTime);
};

module.exports = check;