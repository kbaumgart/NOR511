require('dotenv').config();
const discord = require('discord.js');
// --------------------------------------------
let DE = require('./States/DE.js');
let NJ = require('./States/NJ.js');
let NY = require('./States/NY.js');
let PA = require('./States/PA.js');
let botcmd = require('./Wokers/botCommand.js');

// store commands in own folder, figure out good way to require all files within that folder
//let closures = require('./commands/closures.js');
//let reactionadd = require('./events/reactionadd.js');
// ---------------------------------------------
const client = new discord.Client({
  intents: discord.Intents.FLAGS.GUILD_MESSAGES
});
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
      }
      else if (config.ownerID.includes(message.author.id)) {
          if (message.content.startsWith('$reload')) {
            //delete require.cache[require.resolve('./commands/closures.js')];  future enhancement
            delete require.cache[require.resolve('./Workers/Embeds.js')];
            delete require.cache[require.resolve('./Workers/returndata.js')];
            delete require.cache[require.resolve('./Workers/botCommand.js')];
            delete require.cache[require.resolve('./Workers/LinkCreator.js')];
            delete require.cache[require.resolve('./Workers/Status.js')];
            delete require.cache[require.resolve('./Workers/TimeCorrect.js')];
            delete require.cache[require.resolve('./States/DE.js')];
            delete require.cache[require.resolve('./States/PA.js')];
            delete require.cache[require.resolve('./States/NY.js')];
            delete require.cache[require.resolve('./States/NJ.js')];
            //delete require.cache[require.resolve('./events/reactionadd.js')]; future enhancement
            //closures = require('./commands/closures.js');
            DE = require('./States/DE.js');
            PA = require('./States/PA.js');
            NJ = require('./States/NJ.js');
            NY = require('./States/NY.js');
            //reactionadd = require('./events/reactionadd.js');
            message.channel.send("Modules Reloaded.");

          }
          else {
            botcmd.botComm(client, message);
          }
}});
  

      // Run the update functions every minute
      setInterval(function () {
        PA.Pull(process.env.PAToken, client);
        NY.Pull(process.env.NYToken, client);
        NJ.Pull(client);
        DE.Pull(client);
      }, 60 * 1000);