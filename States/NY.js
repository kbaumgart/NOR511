/*------511NY parser ---------
*/
//required modules
const fetch = require('node-fetch');
const TimeCorrect = require("../Workers/TimeCorrect.js");
const sql = require("../Workers/DB.js");
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json')

//NY Specific Variables
const NotNY = ['Pennsylvania Statewide', 'New Jersey Statewide', 'Connecticut Statewide'];
var NYEvents;


module.exports = {
  Pull: function pull(x, bot) { //x for the API token, bot is the client object from index.js
    bot.NYChannel = bot.channels.cache.get(`${config.NY.Channel}`); //need to cache the channel to send the message to without any input needed
    console.log('Checking 511NY....');
    fetch(`https://511ny.org/api/getevents?key=${x}&format=json`) //call511ny, use the access token in the argument provided
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        NYEvents = Object.keys(json).length; //determine length of response
        for (let i = 0; i < NYEvents; i++) {
          let entry = json[i];
          if (NotNY.includes(entry.RegionName) == false && entry.EventType != 'transitMode') { //skip anything not NY & transit notices
            sql.db.get(`SELECT * FROM NY WHERE ID = "${entry.ID}"`, function (err, row) {
              if (err) {
                throw err;
              }
              if (!row) { // if the entry is not in the table, add it in
                sql.db.serialize().run(`INSERT INTO NY (ID, RoadwayName, Latitude, Longitude, RegionName, County, Direction, Description, Location, LanesAffected, LanesStatus, FirstArticleCity, SecondCity, EventType, EventSubType, LastUpdated, Reported, StartDate, PlannedEndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NY(entry));
                console.log(`${entry.ID} added to database`);
              if (entry.EventType == 'closures') { //first kind of closure type event
                bot.NYChannel.send(Embeds.NYClose(entry)).then(msg => {sql.db.run(`UPDATE NY SET MessageID = ${msg.id} WHERE ID = "${entry.ID}"`)});
              }
              if (entry.EventType != 'closures' && entry.LanesAffected == 'all lanes' &&entry.LanesStatus == 'closed') { //do not want duplicate sends, want to make sure all lanes in a direction are closed
              bot.NYChannel.send(Embeds.NYClose(entry)).then(msg => {sql.db.run(`UPDATE NY SET MessageID = ${msg.id} WHERE ID = "${entry.ID}"`)}); //send the message, store the ID for later features
            }
              }
            });


          }
        }
        UpdateDB(json, bot); //cleaning the db function
      });
    console.log('Update Complete!');
  }
};
process.on('exit', () => sql.close());
/*process.on('SIGHUP', () => process.exit(128 + 1));
//process.on('SIGINT', () => process.exit(128 + 2));
//process.on('SIGTERM', () => process.exit(128 + 15))*/

function UpdateDB(e, bot) {
  sql.db.each("SELECT ID FROM NY", function (err, row) {
    if (err) throw err;
    let closureindex = 0;
    let closurevalid = false;
    while (closureindex < NYEvents) {
      if (row.ID == e[closureindex].ID) {
        closurevalid = true;
      }
      closureindex++;
    }
    if (!closurevalid) {
      console.log(`remove Event ${row.ID}`);
      if (e.EventType == 'closures') {
      bot.NYChannel.send(Embeds.NYOpen(sql.db.get(`SELECT * FROM NY WHERE ID = "${row.ID}`)));}
      if (e.EventType != 'closures' && e.LanesAffected == 'all lanes' &&e.LanesStatus == 'closed') {bot.NYChannel.send(Embeds.NYOpen(sql.db.get(`SELECT * FROM NY WHERE ID = "${row.ID}`)))}
      sql.db.run(`DELETE FROM NY WHERE ID = "${row.ID}"`);

    }
  });
}