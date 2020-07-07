/*------511NY parser ---------
 */
//required modules
const fetch = require('node-fetch');
const TimeCorrect = require("../Workers/TimeCorrect.js");
const sql = require("../Workers/DB.js");
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json');

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
                if (entry.EventType == 'closures' || (entry.EventType != 'closures' && entry.LanesAffected == 'all lanes' && (entry.LanesStatus == 'closed' || entry.LanesStatus == "blocked"))) {
                  sql.db.serialize().run(`INSERT INTO NY (ID, RoadwayName, Latitude, Longitude, RegionName, County, Direction, Description, Location, LanesAffected, LanesStatus, FirstArticleCity, SecondCity, EventType, EventSubType, LastUpdated, Reported, StartDate, PlannedEndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NY(entry));
                  console.log(`${entry.ID} added to database`);
                  bot.NYChannel.send(Embeds.NYClose(entry)).then(msg => {
                    sql.db.run(`UPDATE NY SET MessageID = ${msg.id} WHERE ID = "${entry.ID}"`);
                  });
                }
                if ((row) && (row.LanesStatus != entry.LanesStatus)) {
                  bot.NYChannel.send(Embeds.NYOpen(sql.db.get(`SELECT * FROM NY WHERE ID = "${row.ID}`))).then(msg => {
                    sql.db.run(`DELETE FROM NY WHERE ID = "${row.ID}"`);
                  });
                }
              }
            });


          }
        }
        UpdateDB(json, bot); //cleaning the db function
      })
      .catch(err => {
        throw err;
      });
    console.log('Update Complete!');
  }
};
process.on('exit', () => sql.close());
/*process.on('SIGHUP', () => process.exit(128 + 1));
//process.on('SIGINT', () => process.exit(128 + 2));
//process.on('SIGTERM', () => process.exit(128 + 15))*/

function UpdateDB(e, bot) {
  sql.db.each("SELECT * FROM NY", function (err, row) {
    if (err) throw err;
    let closureindex = 0;
    let closurevalid = false;
    while (closureindex < e.length) {
      if (row.ID == e[closureindex].ID) {
        closurevalid = true;
      }
      closureindex++;
    }
    if (!closurevalid) {
      console.log(`remove Event ${row.ID}`);
      bot.NYChannel.send(Embeds.NYOpen(row)).then(msg =>
        sql.db.run(`DELETE FROM NY WHERE ID = "${row.ID}"`));

    }
  });
}