// CONSTANTS LIBS + DB INI
const Discord = require('discord.js');
const bot = new Discord.Client();
const firebase = require('firebase');
const DB = require('./files/DB.js');

// LET IMPORTANTES
let exportObj = module.exports = {};
let wizard_creation_base = require('./files/wizard_creation_base.js');
let Database = new DB();
exportObj.database = Database;
exportObj.bot = bot;

// CONSTANTS FILES 
let commands = require('./command.js');
const spells = require('./spells.js'); 
const check = require('./files/check.js');
const fct_choose_home = require('./files/survey.js');
const reaction_command = require('./files/reaction_command.js');

// CONSTANTS VAR
const id_guild = process.env.ID_GUILD;
const tag = "wiz-";
const token = process.env.TOKEN;

// on fusionne les deux fichiers pour avoir un seul fichier de commandes lors de l'execution
commands = commands.concat(spells);

// on récupère tout les noms de commandes une seule fois, ca nous évite à chaque msg de devoir recalculer
let aCommands = [];
for(i=0; i<commands.length; i++) {
    aCommands.push(commands[i].name);
}
console.log(aCommands);

/** ******************************************************************* **/
/** ******************************************************************* **/

// quand un user écrit un msg
bot.on('message', (msg) => {
    member = msg.author;
    if(member.id != "316639200462241792" && member.id != "207218344187789315") {
        return;
    }

    check(member.id, member.username+"#"+member.discriminator, member.avatarURL, member);
    
        Database.setAuthor(msg.author);
        Database.profile(msg.author.id);
        
        roles = ['Gryffindor','Hufflepuff','Ravenclaw','Slytherin'];
        // on actualise toutes les infos en ligne
        // si l'utilisateur n'est pas dans une maison / ou si le bot est reset
        for(i in roles) {
            role = msg.guild.roles.find('name',roles[i]).id;
            if(msg.guild.members.get(member.id).roles.has(role)) {
                Database.updateData('game/home', {name:roles[i],id:role});
            }
        }

        let profile_data = [];

        Database.getData('', function(data) {
            profile_data = data.val();
        });

        setTimeout(() => {
            if(profile_data.account.banned==0 && profile_data.account.active==1) {
                if(profile_data.game.home == "choosing") {
                    fct_choose_home(msg, member);
                } else {
                    get_message(msg, profile_data);
                }

                Database.updateData('game/xp', profile_data.game.xp+0.1);
            }
        }, Database.responseTime+300);
});

/** ******************************************************************* **/
/** ******************************************************************* **/
/* si un user réagit */

bot.on('messageReactionAdd', (reaction, user) => {
    if(user.id!="457192864645120000") reaction_command(reaction, user);
});

/** ******************************************************************* **/
/** ******************************************************************* **/
/* quand le bot est lancé */

bot.on('ready',() => {
    bot.user.setActivity('wiz-spells','https://twitch.tv/Wizard');
    bot.user.setStatus('online');

    let embed = new Discord.RichEmbed()
        .setTitle(' the Magic begins !') 
        .setColor(0xF9B234)
        .addField(" • status : online ", " \"  `wiz-spells` \"  for list of spells   <:hedwig:459380510951735297>");
    console.log("I'm ready");
       //bot.guilds.find('id',id_guild).channels.find('name','diagon_alley').send(embed);
});
 
/** ******************************************************************* **/
/** ******************************************************************* **/
/* quand un new user rejoind le server */

bot.on("guildMemberAdd", member => {
    let role = member.guild.roles.find('name', 'Muggle');
    member.addRole(role);

    let embed = new Discord.RichEmbed()
        .setTitle('a Muggle !') 
        .setColor(0xF9B234)
        .addField(` • ` + member.user.username + " Welcome to The Marauders ");
        
    bot.guilds.find('id', id_guild).channels.find('name','diagon_alley').send(embed);
    check(member.id, member.user.username+"#"+member.user.discriminator, member.user.avatarURL, member, true);
});


/** ******************************************************************* **/
/** ******************************************************************* **/
/* functions */

function get_message(msg, profile) {
    if(msg.content.indexOf(tag) === 0) {
        let command = msg.content.split(tag)[1].split(' ')[0];
        if(aCommands.indexOf(command) > -1) {
            let args = msg.content.replace("wiz-"+command, "").replace(" ","");
            command = commands[aCommands.indexOf(command)];
            try {command.result(msg, profile, args)}
            catch (error) {console.log(error);}
        } else {
            msg.channel.send("Spell does not exist, little wizard. Read all books, to know all existing spells !");
        }
    }
}

// sert à connecter le bot
bot.login(token);
