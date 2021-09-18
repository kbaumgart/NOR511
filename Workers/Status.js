
const sql = require('./DB.js');              //Sqlite3 DB functions
const fetch = require('node-fetch');
const moment = require('moment-timezone');
var tileDate = "";

module.exports = {
    main: function (client) {
        statusChannel = client.channels.cache.find(channel => channel.id === "376920694476242945"); //735149439341166600 #test on testing server
        fetch('https://status.waze.com/feeds/posts/default')
            .then(response => response.text())
            .then(advisoryResponse => {
                var parseString = require('xml2js').parseString;
                parseString(advisoryResponse, function (err, result) {
                    for (i = 0; i < 1; i++) {
                        if (result.feed.entry[i].title[0]._.includes("North American")) {
                            var title = result.feed.entry[i].title[0]._;
                            var newTileDate = title.match(/(?<=: ).*/)[0];
                            newTileDate = moment.tz(new Date(newTileDate),"America/New_York").format('LLL');
                            var updateTime = moment.tz(new Date(result.feed.entry[i].updated),"America/New_York").format('LLL');
                            sql.db.get(`SELECT * FROM tileStatus`, function (err, row) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }
                                if (!row) {
                                    sql.db.run(`INSERT INTO tileStatus (timestamp) VALUES ("")`);
                                    console.log("No rows. Row inserted.");
                                } else {
                                    if (row.timestamp != newTileDate) {
                                        statusChannel.send({ embed: { color: 3447003, title: "North American map tiles updated to " + newTileDate + " (Eastern)", description: "Updated: " + updateTime + " (Eastern)" } });
                                        sql.db.run(`DELETE FROM tileStatus`);
                                        sql.db.run(`INSERT INTO tileStatus (timestamp) VALUES ("${newTileDate}")`);
                                        console.log("Inserted.");
                                    }
                                }
                            });
                        }
                    }
                });
            });
    }
};
