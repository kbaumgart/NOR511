const LinkCreator = require('../Workers/LinkCreator.js');
const sql = require('../Workers/DB.js');
const toCSV = require('objects-to-csv');
const fs = require('fs');
const discord = require('discord.js');
const config = require('../config.json');
const states = ['PA', 'Pennsylvania', 'NY', 'New York', 'DE', 'Delaware', "NJ", 'New Jersey']

module.exports = {
    CSV: function outputcsv(client, message, args) {
      console.log('creating csv');
        if (args[0] == 'STATE') {
            if (args[1] == 'PA') {
                if (!args[2]) {

                    sql.db.all(`SELECT EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, LastUpdate FROM PA WHERE LaneStatus = "closed" OR LaneStatus = "ramp closed"`, function (err, row) {
                        if (err) throw err;
                        new toCSV(row).toDisk('./closures.csv')
                            .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
                            .then(remove => {fs.unlinkSync('./closures.csv')})

                    });
                }
              if (args[2] == 'COUNTY') {
                sql.db.all(`SELECT EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, LastUpdate FROM PA WHERE (LaneStatus = "closed" OR LaneStatus = "ramp closed") AND County = "${args[3]}"`, function (err, row) {
                    if (err) throw err;
                    new toCSV(row).toDisk('./closures.csv')
                        .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
                        .then(remove => {fs.unlinkSync('./closures.csv')})
                });
            }}
        } 
        else if (args[1] == 'NY') {}
        else
      if (args[0] == 'COUNTY' && message.channel == config.PAChannel) {
        sql.db.all(`SELECT EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, LastUpdate FROM PA WHERE (LaneStatus = "closed" OR LaneStatus = "ramp closed") AND County = "${args[1]}"`, function (err, row) {
                    if (err) throw err;
                    new toCSV(row).toDisk('./closures.csv')
                        .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
                        .then(remove => {fs.unlinkSync('./closures.csv')})
                });
      } else {
        message.channel.send(`Invalid syntax <@${message.author.id}>. Correct methods are !closures State <2 letter state code> (optional) County <County Name> or !closures County <County Name> within the respective closure channel.`)
      }
        console.log('csv created');
    }
};