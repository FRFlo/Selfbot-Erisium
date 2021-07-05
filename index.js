const mineflayer = require('mineflayer')
const Discord = require ('discord.js')
const config = require('./config.json')
const fs = require('fs')
const Item = require("prismarine-item")("1.8.9");

const client = new Discord.Client()
const bot = mineflayer.createBot({
    host: 'play.erisium.com',   // IP du serveur
    // port: '29228',           // Port du seveur
    username: config.email,     // Email dans config.json
    password: config.password,  // MDP dans config.json
    // auth: 'microsoft',          // Méthode de connection (Microsoft ou Mojang)
    version: '1.11.2',          // Version de connection du bot
  })

var cooldown = new Set()

function Embed (title, desc, color) {
    if (!color) {color === '#FFFFFF'}
    const SEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor('#' + color)
    client.channels.cache.get(config['logs-channel-id']).send(SEmbed)
}

client.login(config.token)  // Login discord

client.on('ready', () => {
    console.log(`Connecté sur discord en tant que ${client.user.tag}!`);
    Embed('Connecté !', `Votre bot est connecté sur discord en tant que ${client.user.tag}`, '000000')
});

bot.on('login', () => {
    console.log(`Connecté sur minecraft en tant que ${bot.username}`)
    Embed('Connecté !', `Votre bot est connecté sur minecraft en tant que ${client.user.tag}`, '000000')
})

client.on('error', console.log) // Log erreur discord
bot.on('error', console.log)    // Log erreur mc
bot.on('kicked', console.log)   // Log kick
bot.on('banned', console.log)   // Log ban

client.on('message', (message) => {
    if (message.author.bot || message.channel.id !== '831830059291377685') return   // Return si c'est le bot ou pas dans le bon channel
    bot.chat(message.content)   // Push sur serveur le message
})

bot.on('message', (jsonMSG) => {
    var msg = ''    // Définition de la variable "msg"
    for (var key in jsonMSG.extra) {msg += jsonMSG.extra[key].text}     // Récuperation du texte
    if (msg.toLowerCase().includes(" mb")) {    // Check du trigger
    let args = msg.split(" ")   // Split des arguments avec " "
    if (["VIP","VIP+","ULTRA","ULTRA+","ELITE"].includes(args[0])) {    // Detection préfixe
      args.shift()  // Suppression préfixe
    }
    if (args[0] === bot.username || args[0] === '▎') return         // Return si c'est le bot ou un /say
    bot.chat(`/msg ${args[0]} Mumble : ${config.mumble.adress} ۩ ${config.mumble.port}`)  // Lui envoyer le mumble
    Embed('Envoi du mumble', `Envoie du mumble en mp à ${args[0]}`, '57F287')
}
    if (msg == 'ERISIUM ▏ Ce joueur a désactivé la réception des messages.') {
        if (cooldown.has('mb')) return  // Return si en cooldown
        cooldown.add('mb')              // Ajoute un cooldown
        setTimeout(function () {
            cooldown.delete("mb")
        }, 20000)                       // Cooldown de 20 secondes
    }
    if (!config.owner.rank) {
      const owner = config.owner.name
      if (msg.startsWith(`■ Reçu de ${owner} » `)) {
          let cmd1 = msg.split(`■ Reçu de ${owner} » `)
          let cmd2 = cmd1.join(" ").trim().split(" ")
          switch (cmd2[0]) {
            case "!test":
              bot.chat("/say test")
              break
            case "!mb":
              bot.chat(`"/say ${config.mumble.adress} ${config.mumble.port}"`)
              Embed('Envoi du mumble', 'Envoie du mumble en /say', 'FEE75C')
              break
            case "!mumble":
              bot.chat(`"/say ${config.mumble.adress} ${config.mumble.port}"`)
              Embed('Envoi du mumble', 'Envoie du mumble en /say', 'FEE75C')
              break
            case "!tp":
              bot.chat(`/f tp ${config.owner.name}`)
              Embed('Téléportation', `Téléportation vers ${config.owner.name}`, 'EB459E')
              break
            case "!host":
              bot.chat(`/connecttohost HOST-${cmd2[1]}`)
              Embed('Téléportation', `Téléportation vers HOST-${cmd2[1]}`, '5865F2')
              break
              default:
              bot.chat(cmd2.join(" "))
              Embed('Message custom', `Envoie de : ${cmd2.join(" ")}`, 'FFFFFF')
          }
      }
    } else if (config.owner.rank === 'VIP' || 'VIP+' || 'ULTRA' || 'ULTRA+' || 'ELITE') {
      const owner = config.owner.rank + ' ' + config.owner.name
      if (msg.startsWith(`■ Reçu de ${owner} » `)) {
          let cmd1 = msg.split(`■ Reçu de ${owner} » `)
          let cmd2 = cmd1.join(" ").trim().split(" ")
          switch (cmd2[0]) {
            case "!test":
              bot.chat("/say test")
              break
            case "!mb":
              bot.chat(`"/say ${config.mumble.adress} ${config.mumble.port}"`)
              Embed('Envoi du mumble', 'Envoie du mumble en /say', 'FEE75C')
              break
            case "!mumble":
              bot.chat(`"/say ${config.mumble.adress} ${config.mumble.port}"`)
              Embed('Envoi du mumble', 'Envoie du mumble en /say', 'FEE75C')
              break
            case "!tp":
              bot.chat(`/f tp ${config.owner.name}`)
              Embed('Téléportation', `Téléportation vers ${config.owner.name}`, 'EB459E')
              break
            case "!host":
              bot.chat(`/connecttohost HOST-${cmd2[1]}`)
              Embed('Téléportation', `Téléportation vers HOST-${cmd2[1]}`, '5865F2')
              break
              default:
              bot.chat(cmd2.join(" "))
              Embed('Message custom', `Envoie de : ${cmd2.join(" ")}`, 'FFFFFF')
          }
      }
    } else {
      console.log('Grade invalide, veuillez éditer config.owner.rank')
    }
})

