const Discord = require('discord.js');
const main = require('./bot.js');
const DB = main.database;
const firebase = require('firebase');
const quests = require('./files/quests.js');
const items = require('./files/json/items.json');

/** 
 * SPELLS
 * FORMAT :
 * msg, profile, name, args, damge, % dodge
 */

const spells = [
    {
        name: "avada-kedavra",
        description: "",
        result: (msg, profile, args) => {
            call_spell(msg, profile, "avada-kedavra", args, "all", 0);
        }
    },

    {
        name: "sectumsempra",
        description: "",
        result: (msg, profile, args) => {
            call_spell(msg, profile, "sectumsempra", args, 80, 5);
        }
    },

    {
        name: "endoloris",
        description: "",
        result: (msg, profile, args) => {
            call_spell(msg, profile, "endoloris", args, 65, 5);
        }
    },

    {
        name: "stupefix",
        description: "",
        result: (msg, profile, args) => {
            call_spell(msg, profile, "stupefix", args, 20, 40);
        }
    }
];


/** 
 * FONCTION QUI GERE AUTOMATIQUEMENT LES SPELLS
 * @param object    msg objet discord
 * @param object    profile 
 * @param string    name_spell nom du sort
 * @param string    $target cible du sort
 * @param int       dmg dommages
 * @param int       escape % de chance d'esquiver le sort
 * @return void
 */
function call_spell(msg, profile, name_spell, $target, dmg, escape) {

    let $target = $target || "undefined-target";
    
    let spells = profile.game.spells;
    if (!(/wand/.test(profile.game.inventory))) {
        msg.channel.send("You need a wand to cast a spell :joy:");
    } else if(spells=="") {
        msg.channel.send("You have not spells.\nTo obtain one, you must reach some levels");
    } else {
        let have_this_spell = false;
        (spells[name_spell]==undefined)? 1 : have_this_spell = true; 

        if(!have_this_spell) msg.channel.send('You have not learned this spell yet');
        
        else {
            if($target=="undefined-target") {
                msg.channel.send("Hmmm... if you cast a spell, it's on a wizard...");
                return;
            }
            if(!(/<@!?\d+>/.test($target))) {
                msg.channel.send("Hmmm... if you cast a spell, it's on a wizard...");
                return;
            }

            console.log("end: "+$target);
            let $id = $target.replace(/(\s+)?<@!?(\d+)>/, "$2");
            console.log('id: '+$id);

            if($id == msg.author.id) {
                msg.channel.send("We don't accept suicidal in our community");
            } else {
                let $profile = [];
                
                DB.profile($id).getData('', function(data) {
                    $profile = data.val();
                });

                setTimeout(() => {
                    if($profile==undefined) {
                        msg.channel.send("This user are not yes in the Harry Potter world, so you can't attack him :pensive:");
                    } else if($profile.game.hp==0) {
                        msg.channel.send("Why want you to attack a dead player ?");
                    } else {
                        let dodge_random = math.floor(math.random()*100);
                        let $dodge = ($profile.game.dodge*dodge_random)/100;
                        if($dodge > escape) {
                            msg.channel.send($profile.account.name+" has dodge your attack !");
                        } else {
                            if(dmg = "all") dmg = $profile.game.hp;
                            let $hp = $profile.game.hp - dmg;
                            if($hp<0) $hp = 0;
                            DB.profile($id).updateData('game/hp', $hp);
                            msg.channel.send("You attacked "+$profile.account.name+" !");
                        }
                    }
                }, DB.responseTime);
            }
        }
    }
}

module.exports = spells;