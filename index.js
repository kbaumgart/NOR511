const discord = require('discord.js');
//--------------------------------------------
//const DE = require('./States/DE.js');
const NJ = require('./States/NJ.js');
const NY = require('./States/NY.js');
const PA = require('./States/PA.js');
// store commands in own folder, figure out good way to require all files within that folder
const closures = require('./commands/closures.js');
const reactionadd = require('./events/reactionadd.js');
//---------------------------------------------
const client = new discord.Client();
//-------config file
const config = require('./config.json');
const sql = require('./Workers/DB.js');
const {
  builtinModules
} = require('module');
const toCSV = require('objects-to-csv');
//----- express server so things can keep running
const keep_alive = require('./keep_alive.js');
const returndata = require('./Workers/returndata.js');
//--Discord login for the bot

client.login(process.env.DiscordToken);

//Start an update request for each state
client.on("ready", () => {
  console.log("I am ready!");
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
});

//Command handler - more to come in this section
client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  } else if (message.content.startsWith('$sqlcommand')) {
    let command = message.content.replace("$sqlcommand", "");
    console.log(command);
    sql.db.run(command);
  } else
  if (message.content.startsWith("!closures")) {
    let args = message.content.trim().toUpperCase().split((/ +/g));
    let command = args.shift().toLowerCase();
    closures.CSV(client, message, args);
  } else if (message.content.startsWith("!search")) {
    let args = (message.content.trim().toUpperCase().split((/ +/g)))
    console.log(args);
    let numberstring = parseFloat(args[1])
    console.log(numberstring)
    let find = `SELECT PA.Facility, CLOSURE.UserID FROM PA INNER JOIN CLOSURE ON PA.MessageID = CLOSURE.MessageID WHERE PA.MessageID = "${args[1]}"`;
    console.log(find);
    sql.db.get(find, function (err, row) {
      if (err) throw err;
      console.log(row)
      message.channel.send(`Road: ${row.Facility} was closed by ${row.UserID}`);
    });
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  let message = reaction.message,
    emoji = reaction.emoji.name;
  if (reaction.emoji == "\:middle_finger:") {
    message.channel.send("Thanks for nothing");
  } else
  if (emoji == "💩") {
    console.log(reaction);
    reactionadd.associateID(reaction);
    message.channel.send('eww');
  }
});

//Run the update functions every minute
setInterval(function () {
  PA.Pull(process.env.PAToken, client);
  NY.Pull(process.env.NYToken, client);
  NJ.Pull(client);
}, 60 * 1000);