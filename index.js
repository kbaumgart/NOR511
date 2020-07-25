const discord = require('discord.js');
// --------------------------------------------
let DE = require('./States/DE.js');
let NJ = require('./States/NJ.js');
let NY = require('./States/NY.js');
let PA = require('./States/PA.js');
// store commands in own folder, figure out good way to require all files within that folder
let closures = require('./commands/closures.js');
let reactionadd = require('./events/reactionadd.js');
// ---------------------------------------------
const client = new discord.Client();
// -------config file
const config = require('./config.json');
const sql = require('./Workers/DB.js');
const {
  builtinModules
} = require('module');
// --Discord login for the bot

client.login(process.env.DiscordToken);

// Start an update request for each state
client.on('ready', () => {
  console.log('I am ready!');
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
  DE.Pull(client);
});

// Command handler - more to come in this section
client.on('message', (message) => {
  if (message.content.startsWith('ping')) {
    message.channel.send('pong!');
  } else if ((message.content.startsWith('$reload') && (config.ownerID.includes(message.author.id)))) { 
    delete require.cache[require.resolve('./commands/closures.js')];
				delete require.cache[require.resolve('./Workers/Embeds.js')];
				delete require.cache[require.resolve('./Workers/ReturnData.js')];
				delete require.cache[require.resolve('./States/DE.js')];
        delete require.cache[require.resolve('./events/reactionadd.js')];
				closures = require('./commands/closures.js');
        DE = require('./States/DE.js');
        PA = require('./States/PA.js');
        NJ = require ('./States/NJ.js');
        NY = require('./States/NY.js');
        reactionadd = require('./events/reactionadd.js');
				message.channel.send("Modules Reloaded.");

  } else
  if (message.content.startsWith('!export')) {
    let args = message.content.trim().toUpperCase().split((/ +/g));
    const command = args.shift().toLowerCase();
    closures.CSV(client, message, args);
    console.log(command);
  } else 
  if (message.content.startsWith('!close')) {
    let args = message.content.trim().toUpperCase().split((/ +/g));
    const command = args.shift().toLowerCase();
    console.log(args);
    sql.db.get(`SELECT * FROM ${args[0]} WHERE EventID = "${args[1]}"`, (err, row) => {
      if (err) throw err;
      if (!args[1]) { message.channel.send('Improper format, !closure <state> <event ID>');}
      console.log(`Event ${args[1]} entered into database and assigned to ${message.author.id}`);
      message.channel.send(`Event ${args[1]} has been assigned. You will be notified once the roadway reopens.`);
      sql.db.run(`INSERT INTO CLOSURE VALUES ("${row.MessageID}", "${message.author.id}", "${message.channel.id}", "${message.guild.id}", "${new Date()}")`);
    });
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const emoji = reaction.emoji.name;
if (reaction.message.author.bot) {
  if ((config.closure_emoji.includes(emoji)) || (config.closure_emoji.includes(reaction.emoji.id))) {
    reactionadd.associateID(reaction, 1);
  }
  else if ((config.schedule_eomji.includes(emoji)) || (config.closure_emoji.includes(reaction.emoji.id))) {
    reactionadd.associateID(reaction, 0);
  }}
});

// Run the update functions every minute
setInterval(function () {
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
  DE.Pull(client);
}, 60 * 1000);
