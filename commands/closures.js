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
      if (args[1] == 'NY') {
        if (!args[2]) {
          NYCSV(message);
        } else 
        if (args[2] == 'COUNTY') {
          if (args[3] == 'NEW') {
            let cty = `${casefix(args[3])} ${casefix(args[4])}`;
            NYCountyCSV(message, cty);
          }
          else {
            NYCountyCSV(message,casefix(args[3]));
          }

        }
      } else
      if (args[1] == 'NJ') {
        if (!args[2]) {
          NJCSV(message);
        }
        if (args[2] == 'COUNTY') {
          NJCountyCSV(message, casefix(args[3]));
        }
      }
    } else
    if (args[0] == 'COUNTY') {
      if (message.channel == config.PA.Channel) {
        PACountyCSV(message, args[1]);
      } else
      if (message.channel == config.NY.Channel) {
        if (args[1] == 'NEW') {
          let cty = `${casefix(args[1])} ${casefix(args[2])}`;
          NYCountyCSV(message, cty);
        }
        else {
          NYCountyCSV(message,casefix(args[1]));
        }
      } else
      if (message.channel == config.NJ.Channel) {
        NJCountyCSV(message, casefix(args[1]));
      }
    } 
    else {
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
  sql.db.all(`SELECT EventID, MessageID, Facility, LaneStatus, Description, EventType, County, IncidentMuniName, FromLat, FromLong, ToLat, ToLong, LastUpdate FROM PA WHERE (LaneStatus = "closed" OR LaneStatus = "ramp closed") AND County = "${cty}"`, function (err, row) {
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

function NYCSV(message) {
  sql.db.all('SELECT ID, MessageID, RegionName, County, FirstArticleCity, RoadwayName, Direction, Description, Location, LanesAffected, LanesStatus, LastUpdated, PlannedEndDate, Latitude, Longitude FROM NY', function (err, row) {
    if (err) throw err;
    for (let i = 0; i < row.length; i++) {
      row[i].Link = LinkCreator.WMELink(row[i].Latitude, row[i].Longitude);
    }
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => fs.unlinkSync('./closures.csv'));
  });
}

function NYCountyCSV(message, cty) {
  console.log(cty);
  sql.db.all(`SELECT ID, MessageID, RegionName, County, FirstArticleCity, RoadwayName, Direction, Description, Location, LanesAffected, LanesStatus, LastUpdated, PlannedEndDate, Latitude, Longitude FROM NY WHERE County = "${cty}"`, function (err, row) {
    if (err) throw err;
    for (let i = 0; i < row.length; i++) {
      row[i].Link = LinkCreator.WMELink(row[i].Latitude, row[i].Longitude);
    }
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => fs.unlinkSync('./closures.csv'));
  });
}

function NJCSV(message) {
  sql.db.all(`SELECT ID, MessageID, County, RoadwayName, Description, Direction, CategoryName, LastUpdate, EndDate, Latitude, Longitude FROM NJ WHERE State = 'NJ'`, function (err, row) {
    if (err) throw err;
    for (let i = 0; i < row.length; i++) {
      row[i].Link = LinkCreator.WMELink(row[i].Latitude, row[i].Longitude);
    }
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => fs.unlinkSync('./closures.csv'));
  });
}

function NJCountyCSV(message, cty) {
  sql.db.all(`SELECT ID, MessageID, County, RoadwayName, Description, Direction, CategoryName, LastUpdate, EndDate, Latitude, Longitude FROM NJ WHERE County = "${cty}" AND State = "NJ"`, function (err, row) {
    if (err) throw err;
    for (let i = 0; i < row.length; i++) {
      row[i].Link = LinkCreator.WMELink(row[i].Latitude, row[i].Longitude);
    }
    new toCSV(row).toDisk('./closures.csv')
      .then(csv => message.channel.send(new discord.MessageAttachment('./closures.csv', 'closure.csv')))
      .then(remove => fs.unlinkSync('./closures.csv'));
  });
}

function casefix(x) {
  x = x.toLowerCase();
  x = x.charAt(0).toUpperCase() + x.slice(1);
  return x;
}