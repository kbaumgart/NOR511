/*----- Parser for New Jersey*/

//required modules
const fetch = require('node-fetch');
const TimeCorrect = require("../Workers/TimeCorrect.js");
const sql = require("../Workers/DB.js");
const returndata = require('../Workers/returndata.js');
const Embeds = require('../Workers/Embeds.js');
const config = require('../config.json');

//declared variables for NJ specifically
const events_list = "https://511nj.org/API/client/Map/getEventData";
const events_detail = "https://511nj.org/API/client/Map/getEventPopupData?EventId=";


module.exports = {
    Pull: function NJpull(bot) {
        bot.NJChannel = bot.channels.cache.get(`${config.NJ.Channel}`); //cache the channel so messages can be sent to channel without input needed
        fetch(events_list) //Request the listing of all the events, there's almost no detail in this listing
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                UpdateDB(data, bot);
                for (i = 0; i < data.Data.features.length; i++) { //let's looop through the events from the prior call
                    let entry = data.Data.features[i].properties; //how many events are there?
                    sql.db.serialize().get(`SELECT * FROM NJ WHERE ID = "${entry.EventID}"`, function (err, row) { //are any of these events in the database already?
                        if (err) {
                            throw err;
                        }
                        if (!row) { //if it isn't in the database, add it
                            fetch(events_detail + entry.EventID)
                                .then(res => res.json())
                                .then(function (js) {
                                    if (err) throw err;
                                    let incident = js.Data[0];
                                    if (incident.State != 'NJ') { //if it's not NJ, we do not really need it, but putting in the table saves running the second fetch again
                                        sql.db.serialize().run(`INSERT INTO NJ (ID, RoadwayName, State, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NJ(incident));
                                    } else
                                    if ((incident.State == 'NJ') && ((incident.FullText.includes('ramp closed') || (incident.FullText.includes('all lanes closed'))))) { //only NJ has to have messages sent
                                        //this seems to catch all the events we need to
                                        console.log(`${incident.EventID} added`);
                                        sql.db.serialize().run(`INSERT INTO NJ (ID, RoadwayName, State, Latitude, Longitude, ToLatitude, ToLongitude, Description, LastUpdate, County, Direction, Notes, StartDate, CategoryName, EndDate, MessageID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, returndata.NJ(incident)); //Add the event to the database
                                        //bot.NJChannel.send(Embeds.NJClose(incident)); //send the closure message to the specified channel in line 19, log the message ID for future features
                                    }
                                })
                                .catch(function (error) {
                                    console.log('Request failed', error);
                                });
                        }

                    });
                }
            }).then(function () {console.log('NJ Update Complete');});
    }
};

function UpdateDB(e, bot) {
    sql.db.each("SELECT * FROM NJ", function (err, row) {
        if (err) throw err;
        let closureindex = 0;
        let closurevalid = false;
        while (closureindex < e.Data.features.length) {
            if (row.ID == e.Data.features[closureindex].EventID) {
                closurevalid = true;
            }
            closureindex++;
        }
        if ((!closurevalid) && (row.State == "NJ")) {
            console.log(`remove Event ${row.ID}`);
            //bot.NJChannel.send(Embeds.NJOpen(row)).then(msg =>
            sql.db.run(`DELETE FROM NJ WHERE ID = "${row.ID}"`);

        }
        if ((!closurevalid) && (row.State != "NJ")) {
            sql.db.run(`DELETE FROM NJ WHERE ID = "${row.ID}"`);
        }
    });
}