const Discord = require('discord.js');
let main = require('./bot.js');
let DB = main.database;
let firebase = require('firebase');
let quests = require('./files/quests.js');

const commands = [
    {
      name : 'spells',
      description : '',
      result : (message) => {
            let embed = new Discord.RichEmbed()
                .setTitle('Wizard Spells')
                .setColor(0xF9B234)
                .addField(" • Profile & Quests : ", " • profile \n • quest \n • shop ")
                .addField(" • Spells : ", " • avada-kedavra \n • endoloris \n • sectumsempra \n • stupefix");
                
            return embed;
        }
    },
    {
        name : 'quest',
        description : '',
        result : (message) => {
            quests(message, message.author.id);
            /* let embed = new Discord.RichEmbed()
                    .setTitle(' Quest ' + list[2] + ' ! ')
                    .setColor(0xF9B234)
                    .addField(" • " + erreur, resol)
                    .addField(" • gifts : ", gifts);
                message.channel.send(embed);
                firebase.database().ref('/profiles/' + message.author.id).update({
                    quest: evl,
                    gallion: gGalleons
                });*/
        }
    },

    {
        name : 'shop',
        description : '',
        result : (message) => {
            items = {};
            DB.source('items').getData('', function(data) {
                items = data.val();
            });


            setTimeout(function() {
                let txt = "";
                let j = 1;
                for(i in items) {
                    let end = "";
                    if(j%3==0) end = '\n'+(' '.repeat(25-items[i].name.length));
                    j++;
                    txt += "<:"+items[i].name+":"+items[i].id+"> : "+items[i].price+"£ "+end;
                }

                let embed = new Discord.RichEmbed()
                .setTitle('shop') 
                .setColor(0xF9B234)
                .addField(' • Items :',txt);

            
                message.channel.send(embed)
                    .then(function (message) {
                        for(i=0; i<Object.keys(items); i++) {
                            message.react(":"+items[i].name+":");
                            console.log(items[i].name);
                        }
                        
                });

                /*for(i in items) {
                    emoji = "<:"+items[i].name+":"+items[i].id+">".toString();
                    message.channel.send(emoji);
                }
                message.channel.send('<:cauldron:496029477558812682>');*/
            }, DB.responseTime);

            
        }
    },
    {
      name : 'profile',
      description : '',
      result : (message) => {
          let ref = firebase.database().ref('/profiles/' + message.author.id);
          let al = [];
          
          ref.on('child_added', function (data) {
               data = data.val();
               al.push(data);
          });
          
          setTimeout(function () {
              if (al.length > 1) {
                  let time = al[4] - Date.now();
                  let nbA = 1;
                  while (time >= 2628002880) {
                      time += 2628002880;
                      nbA++;
                  }
                  
                  /*     2628002880     */
                  
                  let embed = new Discord.RichEmbed()
                      .setTitle(message.author.username)
                      .setColor(0xF9B234)
                      .addField(" • Galleons :     " +  al[0] + "     • Commun Room :     " + al[1], " • xp :     " + al[2] * 10 +  "     • Life :     ", al[3] + "%")
                      .addField(" • years at Hogwarts : " + nbA,  "     • inventory : " + al[2].replace('/', ' ').replace('na', '').replace('wand', '<:wand:459380507503886351>'));

                  message.channel.send(embed);
            }
            else {
                let randomCode = Math.round(Math.random() * 10000000) + "_" + message.author.id;
                let newUser = firebase.database().ref('/profiles').child(message.author.id);
                  
                newUser.set({
                    access: randomCode,
                    galleons: 68,
                    inventaire: 'na',
                    maison: 'none',
                    name: message.author.username,
                    picture: message.author.avatar,
                    quest: 0,
                    vie: 100,
                    year: Date.now(),
                    yid: message.author.id
                });
            

                  let embed = new Discord.RichEmbed()
                      .setTitle(message.author.username)
                      .setColor(0xF9B234)
                      .addField(" • Galleons : ", 68)
                      .addField(" • Commun Room : ", "none")
                      .addField(" • xp : ", 10)
                      .addField(" • Life : ", "100 %")
                      .addField(" • years at Hogwarts : ", 1);
                  message.channel.send(embed)
              }
          }, 1700);
          
            
            
            
      }
    },
    {
      name : 'avada-kedavra',
      description : '',
      result : (message) => {
            try {
                let msg = message.mentions.members.first().id + "";
                let list = [];
                if (msg == message.author.id) {
                    return(' you can\'t use  this spell against you <:hedwig:459380510951735297> ');
                }
                firebase.database().ref('/profiles/' + message.author.id).on('child_added', function(data) {
                    list.push(data.val());
                });
                setTimeout(function () {
                    let inventaire = list[6].split('/');
                    let fot = ''; let erreur = ''; let resol = '';
                    if (inventaire.indexOf('wand') >= 0) {
                        fot = ' cannot ! ';
                        erreur = " you haven\'t a <:wand:459380507503886351> ";
                        resol = " buy one \" `wiz-shop` \" ";
                    }
                    else if (list[3] <= 0) {
                        fot = ' cannot ! ';
                        erreur = " you\'re died <:potion_bottle2:459380508615245834> ";
                        resol = " you can heal yourself by using revive potion \" `wiz-shop` \" ";
                    }
                    else if (list[2] < 32) {
                        fot = ' cannot ! ';
                        erreur = " you have not learn the spell <:wand:459380507503886351> ";
                        resol = " reach 320 xp ";
                    }
                    else {
                        firebase.database().ref('/profiles/' + msg).update({
                            vie:0
                        });
                        let lname = (message.mentions.members.first().nickname ? message.mentions.members.first().nickname : message.mentions.members.first().id);
                        fot = ' success ! ';
                        erreur = " you have kill " + lname;
                        resol = " he can heal himself by drinking revive potion \" `wiz-shop` \" ";
                    }
                    let embed = new Discord.RichEmbed()
                            .setTitle(fot) 
                            .setColor(0xF9B234)
                            .addField(" • " + erreur, resol);
                    message.channel.send(embed);
                 },1700);
            }
            catch (err) {
                return(' mention someone <:hedwig:459380510951735297> ');
            }
       }
    }, 
    {
        name : 'sectumsempra',
        description : '',
        result : (message) => {
              try {
                  let msg = message.mentions.members.first().id + "";
                  let list = [];
                  if (msg == message.author.id) {
                    return(' you can\'t use  this spell against you <:hedwig:459380510951735297> ');
                  }
                  firebase.database().ref('/profiles/' + message.author.id).on('child_added', function(data) {
                      list.push(data.val());
                  });
                  setTimeout(function () {
                      let inventaire = list[6].split('/');
                      let fot = ''; let erreur = ''; let resol = '';
                      if (inventaire.indexOf('wand') >= 0) {
                          fot = ' cannot ! ';
                          erreur = " you haven\'t a <:wand:459380507503886351> ";
                          resol = " buy one \" `wiz-shop` \" ";
                      }
                      else if (list[3] <= 0) {
                          fot = ' cannot ! ';
                          erreur = " you\'re died <:potion_bottle2:459380508615245834> ";
                          resol = " you can revive by using vivive potion \" `wiz-shop` \" ";
                      }
                      else if (list[2] < 20) {
                          fot = ' cannot ! ';
                          erreur = " you have not learn the spell <:wand:459380507503886351> ";
                          resol = " reach 200 xp ";
                      }
                      else {
                          let vie = ((list[3] - 30) < 0 ? 0 : (list[3] - 30));
                          firebase.database().ref('/profiles/' + msg).update({
                              vie: vie
                          });
                          let lname = (message.mentions.members.first().nickname ? message.mentions.members.first().nickname : message.mentions.members.first().id);
                          fot = ' success ! ';
                          erreur = " you hurt " + lname;
                          resol = " he can revive by drinking revive potion \" `wiz-shop` \" ";
                      }
                      let embed = new Discord.RichEmbed()
                              .setTitle(fot) 
                              .setColor(0xF9B234)
                              .addField(" • " + erreur, resol);
                      message.channel.send(embed);
                   },1700);
              }
              catch (err) {
                return(' mention someone <:hedwig:459380510951735297> ');
              }
         }
      },
      {
        name : 'endoloris',
        description : '',
        result : (message) => {
              try {
                  let msg = message.mentions.members.first().id + "";
                  let list = [];
                  if (msg == message.author.id) {
                    return(' you can\'t use  this spell against you <:hedwig:459380510951735297> ');
                  }
                  firebase.database().ref('/profiles/' + message.author.id).on('child_added', function(data) {
                      list.push(data.val());
                  });
                  setTimeout(function () {
                      let inventaire = list[6].split('/');
                      let fot = ''; let erreur = ''; let resol = '';
                      if (inventaire.indexOf('wand') >= 0) {
                          fot = ' cannot ! ';
                          erreur = " you haven\'t a <:wand:459380507503886351> ";
                          resol = " buy one \" `wiz-shop` \" ";
                      }
                      else if (list[3] <= 0) {
                          fot = ' cannot ! ';
                          erreur = " you\'re died <:potion_bottle2:459380508615245834> ";
                          resol = " you can revive by using vivive potion \" `wiz-shop` \" ";
                      }
                      else if (list[2] < 25) {
                          fot = ' cannot ! ';
                          erreur = " you have not learn the spell <:wand:459380507503886351> ";
                          resol = " reach 250 xp ";
                      }
                      else {
                          let vie = ((list[3] - 50) < 0 ? 0 : (list[3] - 50));
                          firebase.database().ref('/profiles/' + msg).update({
                              vie: vie
                          });
                          let lname = (message.mentions.members.first().nickname ? message.mentions.members.first().nickname : message.mentions.members.first().id);
                          fot = ' success ! ';
                          erreur = " you hurt " + lname;
                          resol = " he can revive by drinking revive potion \" `wiz-shop` \" ";
                      }
                      let embed = new Discord.RichEmbed()
                              .setTitle(fot) 
                              .setColor(0xF9B234)
                              .addField(" • " + erreur, resol);
                      message.channel.send(embed);
                   },1700);
              }
              catch (err) {
                return(' mention someone <:hedwig:459380510951735297> ');
              }
         }
      },
      {
        name : 'stupefix',
        description : '',
        result : (message) => {
              try {
                  let msg = message.mentions.members.first().id + "";
                  let list = [];
                  if (msg == message.author.id) {
                    return(' you can\'t use  this spell against you <:hedwig:459380510951735297> ');
                  }
                  firebase.database().ref('/profiles/' + message.author.id).on('child_added', function(data) {
                      list.push(data.val());
                  });
                  setTimeout(function () {
                      let inventaire = list[6].split('/');
                      let fot = ''; let erreur = ''; let resol = '';
                      if (inventaire.indexOf('wand') >= 0) {
                          fot = ' cannot ! ';
                          erreur = " you haven\'t a <:wand:459380507503886351> ";
                          resol = " buy one \" `wiz-shop` \" ";
                      }
                      else if (list[3] <= 0) {
                          fot = ' cannot ! ';
                          erreur = " you\'re died <:potion_bottle2:459380508615245834> ";
                          resol = " you can revive by using vivive potion \" `wiz-shop` \" ";
                      }
                      else if (list[2] < 15) {
                          fot = ' cannot ! ';
                          erreur = " you have not learn the spell <:wand:459380507503886351> ";
                          resol = " reach 150 xp ";
                      }
                      else {
                          let vie = ((list[3] - 25) < 0 ? 0 : (list[3] - 25));
                          firebase.database().ref('/profiles/' + msg).update({
                              vie: vie
                          });
                          let lname = (message.mentions.members.first().nickname ? message.mentions.members.first().nickname : message.mentions.members.first().id);
                          fot = ' success ! ';
                          erreur = " you hurt " + lname;
                          resol = " he can revive by drinking revive potion \" `wiz-shop` \" ";
                      }
                      let embed = new Discord.RichEmbed()
                              .setTitle(fot) 
                              .setColor(0xF9B234)
                              .addField(" • " + erreur, resol);
                      message.channel.send(embed);
                   },1700);
              }
              catch (err) {
                return(' mention someone <:hedwig:459380510951735297> ');
              }
         }
      } 
];

module.exports = commands;

