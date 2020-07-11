const discord = require('discord.js');
// --------------------------------------------
const DE = require('./States/DE.js');
const NJ = require('./States/NJ.js');
const NY = require('./States/NY.js');
const PA = require('./States/PA.js');
// store commands in own folder, figure out good way to require all files within that folder
const closures = require('./commands/closures.js');
const reactionadd = require('./events/reactionadd.js');
// ---------------------------------------------
const client = new discord.Client();
// -------config file
const config = require('./config.json');
const sql = require('./Workers/DB.js');
const {
  builtinModules
} = require('module');
// ----- express server so things can keep running
const keep_alive = require('./keep_alive.js');
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
  } else if (message.content.startsWith('$sqlcommand')) {
    const command = message.content.replace('$sqlcommand', '');
    console.log(command);
    sql.db.run(command);
  } else
  if (message.content.startsWith('!closures')) {
    let args = message.content.trim().toUpperCase().split((/ +/g));
    const command = args.shift().toLowerCase();
    closures.CSV(client, message, args);
    console.log(command);
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const emoji = reaction.emoji.name;
if (reaction.message.author.bot) {
  if ((closure_emoji.includes(emoji)) || (closure_emoji.includes(reaction.emoji.id))) {
    reactionadd.associateID(reaction);
  }}
});

const closure_emoji = ['⛔', '🛑', '❌', '🚫', '🚧', "355807144597127179", "731614318633680951"];
// Run the update functions every minute
setInterval(function () {
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
  DE.Pull(client);
}, 60 * 1000);
