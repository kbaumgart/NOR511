const discord = require('discord.js');
// --------------------------------------------
let DE = require('./States/DE.js');
let NJ = require('./States/NJ.js');
let NY = require('./States/NY.js');
let PA = require('./States/PA.js');
// store commands in own folder, figure out good way to require all files within that folder
//let closures = require('./commands/closures.js');
//let reactionadd = require('./events/reactionadd.js');
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
  if (message.content === ('ping')) {
    message.channel.send('pong!');
  } else if (message.content.startsWith('$mention')) {
    message.channel.send('hello there <@729443441347526656>')
  }
    else if ((message.content.startsWith('$reload') && (config.ownerID.includes(message.author.id)))) { 
    //delete require.cache[require.resolve('./commands/closures.js')];  future enhancement
				delete require.cache[require.resolve('./Workers/Embeds.js')];
				delete require.cache[require.resolve('./Workers/ReturnData.js')];
				delete require.cache[require.resolve('./States/DE.js')];
        //delete require.cache[require.resolve('./events/reactionadd.js')]; future enhancement
				closures = require('./commands/closures.js');
        DE = require('./States/DE.js');
        PA = require('./States/PA.js');
        NJ = require ('./States/NJ.js');
        NY = require('./States/NY.js');
        reactionadd = require('./events/reactionadd.js');
				message.channel.send("Modules Reloaded.");

  } 
});

// Run the update functions every minute
setInterval(function () {
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
  DE.Pull(client);
}, 60 * 1000);
