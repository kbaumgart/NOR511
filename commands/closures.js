const LinkCreator = require('../Workers/LinkCreator.js');
const sql = require('../Workers/DB.js');
const toCSV = require('objects-to-csv');
const fs = require('fs');
const discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  CSV: function outputcsv(client, message, args) {
    console.log('creating csv');
    if (args[0] == 'STATE') {
      if (args[1] == 'PA') {
        if (!args[2]) {
          PACSV(message);
        }
        if (args[2] == 'COUNTY') {
          PACountyCSV(message, args[3]);
        }
      } else
      if (args[1] == 'NY') {}
    } else
    if (args[0] == 'COUNTY') {
      if (message.channel == config.PA.Channel) {
        PACountyCSV(message, args[1]);
      }
    } else {
      message.channel.send(`Invalid syntax <@${message.author.id}>. Correct methods are !closures State <2 letter state code> (optional) County <County Name> or !closures County <County Name> within the respective closure channel.`);
    }
    console.log('csv created');
  }
};

function PACSV(message) {
  sql.db.all(`SELECT EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, LastUpdate, FromLat, FromLong, ToLat, ToLong FROM PA WHERE LaneStatus = "closed" OR LaneStatus = "ramp closed"`, function (err, row) {
    if (err) throw err;
    for (let i = 0; i < row.length; i++) {
      row[i].FromLink = LinkCreator.WMELink(row[i].FromLat, row[i].FromLong);
      row[i].ToLink = LinkCreator.WMELink(row[i].ToLat, row[i].ToLong);
    }
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => {
        fs.unlinkSync('./closures.csv');
      });

  });
}

function PACountyCSV(message, cty) {
  sql.db.all(`SELECT EventID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, LastUpdate FROM PA WHERE (LaneStatus = "closed" OR LaneStatus = "ramp closed") AND County = "${cty}"`, function (err, row) {
    if (err) throw err;
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => {
        fs.unlinkSync('./closures.csv');
      });
  });
}