const Discord = require('discord.js');
const main = require('./bot.js');
const DB = main.database;
const firebase = require('firebase');
const quests = require('./files/json/quests.json');
const items = require('./files/json/items.json');

const commands = [
    {
        name : 'spells',
        description : '',
        result : msg => {
            let embed = new Discord.RichEmbed()
                .setTitle('Wizard Spells')
                .setColor(0xF9B234)
                .addField(" • Profile & Quests : ", " • profile \n • inventory \n • quest \n • shop ")
                .addField(" • Spells : ", " • avada-kedavra \n • endoloris \n • sectumsempra \n • stupefix");
                
            msg.channel.send(embed);
        }
    },
    
    {
        name : 'profile',
        description : '',
        result : (msg, profile) => {
            let levelUp = Math.round(Math.pow(profile.game.level,2.3)*10);

            let embed = new Discord.RichEmbed()
                .setTitle(msg.author.username)
                .setColor(0xF9B234)
                .setThumbnail(profile.account.picture)
                .setDescription(" • Galleons : "+profile.game.galleons+"Ǥ"+
                "\n • Commun Room : "+profile.game.home.name+
                "\n • XP : "+Math.floor(profile.game.xp)+"/"+levelUp+
                "\n • Level : "+profile.game.level+
                "\n • Life : "+profile.game.hp+
                "\n • Quests completed : "+profile.game.quests_completed)
                .setFooter("Years at Hogwarts : " 
                + (Math.floor((Date.now()-profile.account.year)/(3.154*Math.pow(10,10)))+1), '');
            msg.channel.send(embed);
        }
    },

    {
        name: "shop",
        description: "",
        result: msg => {
            let txt = "";
            let j = 1;
            let emojis = [];

            for(i in items) {
                let end = ('.'.repeat(40-(items[i].price.length)))
                if(j%3==0 || i==items.length-1) end = '\n';
                j++;
                let emoji = "<:"+items[i].name+":"+items[i].id+">";
                emojis.push(items[i].id);
                txt += "<:"+items[i].name+":"+items[i].id+"> : "+items[i].price+"Ǥ "+end;
            }

            let embed = new Discord.RichEmbed()
                .setTitle("Wizard shop")
                .setColor(0xF9B234)
                .addField("What want you to buy, young sorcerer ?",txt);
            
            msg.channel.send(embed).then(message => {
                for(i in emojis) {
                    message.react(emojis[i]);
                }
            });
        }
    },

    {
        name: "inventory",
        result: (msg, profile) => {
            let inventory = profile.game.inventory;

            if(inventory=="") {
                inventory = "You have no object";
                msg.channel.send(inventory);
                return;
            } else {
                if(/ /gi) inventory = inventory.split(" ");
                else inventory = [inventory];
                
                let txt = "";
                let new_inventory = {};

                for(i in inventory) {
                    let item = inventory[i].replace(/_/gi, " ");

                    new_inventory[item] = typeof(new_inventory[item])=='undefined'? 1 : new_inventory[item] + 1;
                }

                for(i in new_inventory) {
                    let a = i;
                    if(new_inventory[i]>1) {
                        a += " `(x"+new_inventory[i]+")`";
                    }

                    txt += "• "+a+"\n";
                }

                let embed = new Discord.RichEmbed()
                    .setTitle("Inventory")
                    .setColor(0xF9B234)
                    .setThumbnail(profile.account.picture)
                    .setDescription(txt);
                
                msg.channel.send(embed);
            }
        }
    },

    {
        name: "quest",
        description: "",
        result: (msg, profile) => {
            let quest = [];
            for(i in quests) {
                if(quests[i].id == profile.game.quest) {
                    quest['name'] = quests[i].name;
                    quest['condition'] = quests[i].condition;
                    quest['xp'] = quests[i].reward.xp;
                    quest['galleons'] = quests[i].reward.galleons;
                }
            }

            let embed = new Discord.RichEmbed()
                .setTitle(quest['name'])
                .setColor(0xF9B234)
                .addField("Condition :",quest['condition'])
                .addField("Reward :", " • xp : "+quest['xp']+"\n • galleons : "+quest['galleons']);
            msg.channel.send(embed);
        }
    },

    {
        name: "eval",
        description: "",
        result: (msg, profile, args) => {
            if(msg.author.id=="316639200462241792") {
                try {msg.channel.send(eval(args));}
                catch(error) {msg.channel.send(error)}
            }
        }
    }
];

module.exports = commands;