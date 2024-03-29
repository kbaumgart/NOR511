/* eslint-disable indent */
// for if we ever need VEOC const weather = ['flooding', 'winter weather', 'downed utility', 'downed tree', 'debris on roadway', 'downed tree in wires'];
const closure = ['ramp closure', 'closed'];
const URL = 'https://www.dot511.state.pa.us/RCRS_Event_Data/api/RCRS/liveEvents';
/* PA Specific constants */

const fetch = require('node-fetch');
const TimeCorrect = require('../Workers/TimeCorrect.js');
const sql = require('../Workers/DB.js');
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json');

module.exports = {
    Pull: function pull (x, bot) {
        bot.PAChannel = bot.channels.cache.get(`${config.PA.Channel}`);
        fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + x,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json => {
                console.log('Checking 511PA...');
                const loop = json.Values.length;
                for (let i = 0; i < loop; i++) { // run a loop of all responses
                    let entry = json.Values[i];
                    // create expression to add FromLat, FromLong, ToLat, ToLong key value pairs to use in embeds later
                    if (entry.FromLocLatLong == '') { //ramps are weird, they don't use the From/To fields
                        entry.FromLat = entry.IncidentLocLatLong.split(',')[0];
                        entry.FromLong = entry.IncidentLocLatLong.split(',')[1];
                        entry.ToLat = entry.IncidentLocLatLong.split(',')[0];
                        entry.ToLong = entry.IncidentLocLatLong.split(',')[1];
                    } else {
                        entry.FromLat = entry.FromLocLatLong.split(',')[0];
                        entry.FromLong = entry.FromLocLatLong.split(',')[1];
                        entry.ToLat = entry.ToLocLatLong.split(',')[0];
                        entry.ToLong = entry.ToLocLatLong.split(',')[1];
                    }
                    sql.db.get(`SELECT * FROM PA LEFT JOIN CLOSURE ON PA.MessageID = CLOSURE.MessageID WHERE EventID = ${entry.EventID}`, function (err, row) {
                        if (err) {
                            throw err;
                        }
                        let check = `UPDATE PA SET LaneStatus =  "${entry.LaneStatus}" WHERE EventID = ` + entry.EventID; // simple variable to use to update the db when the time comes
                        if (!row) { // if the EventID does not exist, add it
                            sql.db.run('INSERT INTO PA (EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, DateTimeNotified, CreateTime, LastUpdate, DetourInEffect, ActualDateTimeOpened, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', returndata.PA(entry));
                            if (closure.includes(entry.LaneStatus) === true) { // If the lane status of this EventID is closed, send a message to the closure channel, and to the log
                                console.log(`Closure added for ${entry.Facility} because of ${entry.Description}`);
                                bot.PAChannel.send(Embeds.PAClose(entry)).then(msg => {
                                    //sql.db.run(`UPDATE PA SET MessageID = ${msg.id} WHERE EventID = ` + entry.EventID);
                                    //sql.db.run(`INSERT INTO CLOSURE MessageID = ${msg.id}`);
                                });
                            } else {
                                console.log(`${entry.EventID} added as ${entry.Description}`);
                            } // if it isn't a closure, just report out to the console - just here for error checking at this time, probably will be removed in the future
                        }
                        if (typeof row != 'undefined' && row.LaneStatus !== entry.LaneStatus) { // if the current lane status and prior lane status don't match, let's look closer
                            if (closure.includes(row.LaneStatus) === true || closure.includes(entry.LaneStatus) == true) { // if either current or past is or was closed, we need to send a message
                                if (closure.includes(entry.LaneStatus) === true) {
                                    console.log(`Closure added for ${entry.Facility} because of ${entry.Description}`);
                                    bot.PAChannel.send(Embeds.PAClose(entry)).then(msg => {
                                        //sql.db.run(`UPDATE PA SET MessageID = ${msg.id} WHERE EventID = ` + entry.EventID);
                                        //sql.db.run(`INSERT INTO CLOSURE MessageID = ${msg.id}`);
                                    }).catch(err => {
                                        throw err;
                                    });
                                } // if the current status is now closed, send a closure message
                                if (closure.includes(row.LaneStatus) === true) { // if the current status isn't closed, we need to open up that segment
                                    if (row.UserID) {
                                        bot.PAChannel.send(`Event marked closed by <@${row.UserID}>`);
                                        //bot.PAChannel.guild.members.fetch(row.UserID).then(resolve => bot.PAChannel.send(`This was closed by ${resolve.displayName}`));
                                    }
                                    bot.PAChannel.send(Embeds.PAOpen(entry));
                                    console.log(`${entry.EventID} ${entry.Facility} in ${entry.IncidentMuniName}, ${config.PA.Counties[entry.County]} remove closure`);
                                }
                                // report out to console, will be removed
                                else {
                                    console.log(`${entry.EventID} changed to ${entry.LaneStatus} from ${row.LaneStatus}`);
                                } // just an update for minor things to console, not really needed
                                sql.db.run(check);
                            } // in any case - update the db with the new info
                            else {
                                console.log(`${row.EventID} changed from ${row.LaneStatus} to ${entry.LaneStatus}`);
                                if (entry.LaneStatus === 'open') {
                                    sql.db.run(`UPDATE PA SET ActualDateTimeOpened = "${TimeCorrect.PA(entry.ActualDateTimeOpened)}" WHERE EventID = ` + entry.EventID);
                                    sql.db.run(`DELETE FROM PA WHERE EventID = ${entry.EventID}`);
                                    console.log(`${entry.EventID} deleted`);
                                }
                                sql.db.run(check);
                            }
                        }
                    });
                }
                console.log('PA Update Complete!');
            });
    },

};
function UpdateDB(x) {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + x,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
    sql.db.each("SELECT * FROM PA LEFT JOIN CLOSURE ON PA.MessageID = CLOSURE.MessageID", function (err, row) {
      if (err) throw err;
      let closureindex = 0;
      let closurevalid = false;
      while (closureindex < json.Values.length) {
        if (row.EventID == json.Values[closureindex].EventID) {
          closurevalid = true;
        }
        closureindex++;
      }
      if (!closurevalid) {
        console.log(`remove Event ${row.EventID}`);
        console.log(`${row.EventID} has been removed`);
          sql.db.run(`DELETE FROM PA WHERE EventID = "${row.EventID}"`);

  
      }
    });});
  }
  UpdateDB(process.env.PAToken);