/* eslint-disable indent */
/*----- Parser for New Jersey */

// required modules
const fetch = require('node-fetch');
const TimeCorrect = require('../Workers/TimeCorrect.js');
const sql = require('../Workers/DB.js');
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json');

// declared variables for NJ specifically
const events_list = 'https://511nj.org/API/client/Map/getEventData';
const events_detail = 'https://511nj.org/API/client/Map/getEventPopupData?EventId=';


module.exports = {
    Pull: function NJpull (bot) {
        bot.NJChannel = bot.channels.cache.get(`${config.NJ.Channel}`); // cache the channel so messages can be sent to channel without input needed
        fetch(events_list) // Request the listing of all the events, there's almost no detail in this listing
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                for (i = 0; i < data.Data.features.length; i++) { // let's looop through the events from the prior call
                    let entry = data.Data.features[i].properties; // how many events are there?
                    sql.db.serialize().get(`SELECT * FROM NJ WHERE EventID = "${entry.EventID}"`, function (err, row) { // are any of these events in the database already?
                        if (err) {
                            throw err;
                        }
                        if (!row) { // if it isn't in the database, add it
                            fetch(events_detail + entry.EventID)
                                .then(res => res.json())
                                .then(function (js) {
                                    if (err) throw err;
                                    let incident = js.Data[0];
                                    if (incident.State != 'NJ') { // if it's not NJ, we do not really need it, but putting in the table saves running the second fetch again
                                        sql.db.serialize().run('INSERT INTO NJ (EventID, RoadwayName, State, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', returndata.NJ(incident));
                                    } else
                                    if ((incident.State == 'NJ') && ((incident.FullText.toLowerCase().includes('ramp closed') || (incident.FullText.toLowerCase().includes('all lanes closed'))))) { // only NJ has to have messages sent
                                        // this seems to catch all the events we need to
                                        console.log(`${incident.EventID} added`);
                                        sql.db.serialize().run('INSERT INTO NJ (EventID, RoadwayName, State, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', returndata.NJ(incident)); // Add the event to the database
                                        bot.NJChannel.send(Embeds.NJClose(incident)).then(msg => sql.db.run(`UPDATE NJ SET MessageID = ${msg.id} WHERE EventID = "${incident.EventID}"`)); // send the closure message to the specified channel in line 19, log the message ID for future features
                                    }
                                })
                                .catch(function (error) {
                                    console.log('Request failed', error);
                                });
                        }

                    });
                }
                UpdateDB(data, bot);
            }).then(function () {console.log('NJ Update Complete');});
    }
};

function UpdateDB(e, bot) {
    sql.db.each('SELECT * FROM NJ LEFT JOIN CLOSURE ON NJ.MessageID = CLOSURE.MessageID', function (err, row) {
        if (err) throw err;
        let closureindex = 0;
        let closurevalid = false;
        while (closureindex < e.Data.features.length) {
            if (row.EventID == e.Data.features[closureindex].properties.EventID) {
                closurevalid = true;
            }
            closureindex++;
        }
        if ((!closurevalid) && (row.State == 'NJ')) {
          /*  if (row.UserID) {
                bot.NJChannel.guild.members.fetch(row.UserID).then(resolve => bot.NJChannel.send(`This was closed by ${resolve.displayName}`));
            } */
            console.log(`remove Event ${row.EventID}`);
            bot.NJChannel.send(Embeds.NJOpen(row)).then(msg =>
            sql.db.run(`DELETE FROM NJ WHERE EventID = "${row.EventID}"`));

        }
        if ((!closurevalid) && (row.State != 'NJ')) {
            sql.db.run(`DELETE FROM NJ WHERE EventID = "${row.EventID}"`);
        }
    });
}