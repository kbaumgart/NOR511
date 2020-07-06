/*----- Parser for New Jersey*/

//required modules
const fetch = require('node-fetch');
const TimeCorrect = require("../Workers/TimeCorrect.js");
const sql = require("../Workers/DB.js");
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json');

//declared variables for NJ specifically
var NJEvents;
const events_list = "https://511nj.org/API/client/Map/getEventData";
const events_detail = "https://511nj.org/API/client/Map/getEventPopupData?EventId=";


module.exports = { Pull: 
function NJpull(bot) {
    bot.NJChannel = bot.channels.cache.get(`${config.NJ.Channel}`); //cache the channel so messages can be sent to channel without input needed
    fetch(events_list) //Request the listing of all the events, there's almost no detail in this listing
        .then(function (response) {
            NJEvents = Object.keys(response).length;
            // UpdateDB(response);
            return response.json(); 
        })
        .then(function (data) {
            for (i = 0; i < data.Data.features.length; i++) { //let's looop through the events from the prior call
                let entry = data.Data.features[i].properties; //how many events are there?
                sql.db.serialize().get(`SELECT * FROM NJ WHERE ID = '${entry.EventID} '`, function (err, row) { //are any of these events in the database already?
                    if (err) {
                        throw err;
                    }
                    if (!row) { //if it isn't in the database, add it
                        fetch(events_detail + entry.EventID)
                            .then(response => response.json())
                            .then(function (js) {
                                if (err) throw err;
                                let incident = js.Data[0];
                                if (js.Data[0].State != 'NJ') { //if it's not NJ, we do not really need it, but putting in the table saves running the second fetch again
                                    sql.db.serialize().run(`INSERT INTO NJ (ID, RoadwayName, EventState, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NJ(incident));
                                } else
                                if (js.Data[0].State == 'NJ') { //only NJ has to have messages sent

                                    console.log(`${incident.EventID} added`);
                                    sql.db.serialize().run(`INSERT INTO NJ (ID, RoadwayName, EventState, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NJ(incident)); //Add the event to the database
                                    if ((incident.FullText.includes('ramp closed') || (incident.FullText.includes('all lanes closed')))) { //this seems to catch all the events we need to
                                        bot.NJChannel.send(Embeds.NJClose(incident)); //send the closure message to the specified channel in line 19, log the message ID for future features
                                        //add a section here to update the sql database with it being a closure using the notes field as it appears that is not used by NJDOT, will make it easier for the open message to be sent
                                    }

                                }

                            })
                            .catch(function (error) {
                                console.log('Request failed', error);
                            });
                    }

                });
            }
        }).then(function () {

            console.log('NJ Update Complete');
        });
  }
}
function UpdateDB(e) { //basic function to remove old closures, still in testing
    sql.db.each("SELECT ID FROM NJ", function (err, row) {
        if (err) throw err;
        let closureindex = 0;
        let closurevalid = false;
        while (closureindex < NJEvents) { //looop the values between what comes back from the first request to what is in the database
            if (row.ID == e[closureindex].EventID) {
                closurevalid = true;
            }
            closureindex++;
        }
        if (!closurevalid) {
            console.log(`remove Event ${row.ID}`);
            /*if (e.EventType == 'closures') {
                bot.NJChannel.send(Embeds.NYOpen(sql.db.get(`SELECT * FROM NJ WHERE ID = "${row.ID}`)));
            }
            if (e.EventType != 'closures' && e.LanesAffected == 'all lanes' && e.LanesStatus == 'closed') {
                bot.NJChannel.send(Embeds.NYOpen(sql.db.get(`SELECT * FROM NJ WHERE ID = "${row.ID}`)));
            }*/
            sql.db.run(`DELETE FROM NJ WHERE ID = "${row.ID}"`); //if it's in the DB and not in the json response, remove it and send a message, will need to filter out closure vs non closure

        }
    });
}